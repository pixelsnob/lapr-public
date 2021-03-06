/**
 * Tags tree master view
 * 
 */
define([
  'views/base',
  './tags_list_item'
], function(
  BaseView,
  TagsListItemView
) {
  
  return BaseView.extend({

    tagName: 'ul',

    events: {
    },

    initialize: function(opts) {
      this.products = opts.products;
    },
    
    render: function() {
      var obj = this;
      this.collection.forEach(function(tag) {
        var view = new TagsListItemView({
          model: tag,
          products:  obj.products
        });
        obj.$el.append(view.render().el);
      });
      this.$el.addClass('tags-list');
      return this;
    }

  });
});
