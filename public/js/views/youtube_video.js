/**
 * Youtube video list item view
 * 
 */
define([
  'views/base',
  'template',
  'lib/events'
], function(
  BaseView,
  template,
  global_events
) {
  
  return BaseView.extend({
    
    events: {
      'click a':       'play'
    },

    initialize: function(opts) {
      this.setElement(template.render('partials/youtube_video', {
        video: this.model.toJSON()
      }));
      this.listenTo(global_events, 'yt-stop', this.deselect);
    },
    
    render: function() {
      // Show only if video is available
      var obj = this;
      this.model.getVideoJSON().done(function() {
        obj.$el.removeClass('hide');
      });
      return this;
    },

    play: function(ev) {
      if (this.$el.hasClass('selected')) {
        return false;
      }
      global_events.trigger('yt-play', this.model);
      this.$el.addClass('selected');
      return false;
    },

    deselect: function() {
      this.$el.removeClass('selected');
    }

  });
  
});
