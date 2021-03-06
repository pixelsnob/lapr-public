
define([
  'backbone',
  'lib/events'
], function(Backbone, global_events) {
  
  var stored_route = '';

  var storeRoute = function() {
    var fragment = Backbone.history.getFragment();
    stored_route = fragment.replace(/^\//, '');
  };

  Backbone.history.back = function() {
    Backbone.history.navigate(stored_route);
  };
  
  return Backbone.Router.extend({

    routes: {
      '':                                  'showIndex',
      '/':                                 'showIndex',
      'instruments':                       'showProductsByCategory',
      'instruments/':                      'showProductsByCategory',
      'instruments/categories/:category':  'showProductsByCategory',
      'instruments/tags':                  'showProductsByTags',
      'instruments/tags/':                 'showProductsByTags',
      'instruments/tags/:tags':            'showProductsByTags',
      'instruments/text-search/:search':   'showProductsByTextSearch',
      'instruments/:slug/:product_id':     'showProductDetails',
      'contact':                           'showContact'
    },
    
    initialize: function(opts) {
      this.controller = opts.controller;
      this.listenTo(global_events, 'before-route', function(route, name) {
        if (name != 'showProductDetails') {
          storeRoute();
        }
      });
    },

    // Add a "before route" event
    route: function(route, name, cb) {
      Backbone.Router.prototype.route.call(this, route, name, function() {
        if (!cb) {
          cb = this[name];
        }
        global_events.trigger('before-route', route, name);
        cb.apply(this, arguments);
      });
    },
    
    showIndex: function() {
      this.controller.showIndex();
    },

    showProductsByCategory: function(category) {
      this.controller.showProductsByCategory(category);
    },
    
    showProductsByTags: function(tags) {
      tags = (tags && tags.length ? tags.split(',') : []);
      this.controller.showProductsByTags(tags);
    },

    showProductsByTextSearch: function(search) {
      this.controller.showProductsByTextSearch(search);
    },

    showProductDetails: function(slug, product_id, qs) {
      var hide_nav = /nav=0/.exec(qs) !== null;
      this.controller.showProductDetails(product_id, hide_nav);
    },
    
    showContact: function() {
      this.controller.showContact();
    }

  });

});


