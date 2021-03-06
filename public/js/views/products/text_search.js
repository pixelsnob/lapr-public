/**
 * Products text search results
 * 
 */
define([
  'views/base',
  'views/products',
  'views/products/search_stats',
  'template',
  'lib/events'
], function(
  BaseView,
  ProductsView,
  ProductsSearchStatsView,
  template,
  global_events
) {
  return BaseView.extend({ 
    
    events: {
    },
    
    initialize: function(opts) {
      this.products = opts.products;
      this.products_view = new ProductsView({
        collection: this.products
      });
      this.stats_view = new ProductsSearchStatsView({
        products: this.products
      });
    },

    render: function() {
      this.$el.html(template.render('partials/products_search', {
        products:    [],
        paginate:    null,
        heading:     'Search Results',
        class_name:  'products-text-search'
      }));
      this.$el.addClass('products-text-search');
      this.products_view.setElement(this.$el.find('.products'));
      this.stats_view.setElement(this.$el.find('.stats'));
      global_events.trigger('set-page-title', this.getPageTitle());
      return this;
    },
    
    getPageTitle: function() {
      return 'Search Results';
    },

    onClose: function() {
      this.products.trigger('kill');
      //this.products.unbind();
      //this.products.unbindRefs();
      this.stats_view.close();
      this.products.refs.filtered_products.reset();
    }

  });
});

