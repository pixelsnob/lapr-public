/**
 * Tags tree item view
 * 
 */
define([
  'views/base',
  'lib/events'
], function(
  BaseView,
  vent
) {
  
  return BaseView.extend({

    tagName: 'li',

    events: {
      'click a': 'toggle'
    },

    initialize: function(opts) {
      this.refs = opts.refs;
      var obj = this;
      // Select or deselect if this model exists in selected_tags
      this.listenTo(this.refs.selected_tags, 'add', function(model) {
        if (model.id == obj.model.id) {
          obj.select();
        }
      });
      this.listenTo(this.refs.selected_tags, 'remove', function(model) {
        if (model.id == obj.model.id) {
          obj.deselect();
        }
      });
      // Disable tags that don't exist in current filtered products
      this.listenTo(this.refs.filtered_products, 'reset', function(filtered_products) {
        var products = filtered_products.filter(function(product) {
          return _.contains(product.get('tags'), obj.model.id);
        });
        var a = obj.$el.find('a');
        if (products.length) {
          a.removeClass('disabled');
        } else {
          a.addClass('disabled');
        }
        // determine if this is the only active tag in its group?
      });
    },
    
    toggle: function(ev) {
      if ($(ev.currentTarget).hasClass('disabled')) {
        return false;
      }
      if (this.refs.selected_tags.findWhere({ _id: this.model.id })) {
        this.refs.selected_tags.remove(this.model);
      } else {
        this.refs.selected_tags.add(this.model);
      }
      var slugs = this.refs.selected_tags.map(function(tag) {
        return tag.get('slug');
      });
      var url;
      if (slugs.length) {
        url = '/products/tags/' + slugs.join(',');
      } else {
        url = '/products';
      }
      Backbone.history.navigate(url, true);
      return false;
    },
    
    select: function() {
      this.$el.find('a').css({ fontWeight: 'bold' }); 
    },
    
    deselect: function() {
      this.$el.find('a').css({ fontWeight: 'normal' }); 
    },

    render: function() {
      var a = $('<a>').text(this.model.get('name'))
        .attr('href', '/products/tags/'  + this.model.get('slug'));
      this.$el.append(a);
      return this;
    }

  });
});
