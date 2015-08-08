
define([
  'backbone'
], function(Backbone) {
  
  var history = [],
      navigate = Backbone.history.navigate;

  function addToHistory(fragment) {
    fragment = fragment.replace(/^\//, '');
    if (history[history.length - 1] != fragment) {
      history.push(fragment);
    }
  }

  addToHistory(window.location.pathname);

  Backbone.history.navigate = function(fragment, opts) {
    navigate.apply(this, arguments);
    addToHistory(fragment);
  };

  Backbone.history.back = function(trigger) {
    var previous = history[history.length - 2];
    if (previous) {
      Backbone.history.navigate(previous, { trigger: !!trigger });
    }
  };

  // Store history on browser back/forward
  $(window).on('popstate', function(ev) {
    var fragment = Backbone.history.getFragment();
    //if (fragment) {
      addToHistory(fragment);
    //}
  });

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

    showProductDetails: function(slug, product_id) {
      this.controller.showProductDetails(product_id);
    },
    
    showContact: function() {
      this.controller.showContact();
    }

  });

});


