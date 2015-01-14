/**
 * Products list view
 * 
 */
define([
  'views/base',
  'views/product',
], function(
  BaseView,
  ProductView
) {
  
  return BaseView.extend({

    events: {
      'click .pagination .previous': 'getPreviousPage',
      'click .pagination .next':     'getNextPage'
    },

    initialize: function(opts) {
      this.collection = opts.collection;
      this.refs = this.collection.refs;
      this.setElement(opts.el);
      // Include product admin editor if admin user
      if (window.cms.user) {
        var obj = this;
        require([ 'views/admin/product' ], function(ProductAdminView) {
          var events = {
            'click a.add-product': _.bind(obj.add, obj, ProductAdminView)
          };
          obj.delegateEvents(_.extend(obj.events, events));
        });
      }
      this.listenTo(this.refs.filtered_products, 'add reset change remove', this.render);
      this.listenTo(this.refs.selected_tags, 'add remove reset', this.filterProductsByTags);
      this.listenTo(this.refs.selected_categories, 'add reset', this.filterProductsByCategory);
    },
    
    showProducts: function(){
      this.refs.filtered_products.state.currentPage = 0;
      this.refs.filtered_products.fullCollection.reset(this.collection.models);
    },

    render: function() {
      //console.log('products list render');
      var fragment = document.createDocumentFragment(),
          obj      = this;
      this.refs.filtered_products.forEach(function(product) {
        var view = new ProductView({
          model:              product,
          products:           obj.collection,
          refs:               obj.refs
        });
        fragment.appendChild(view.render().el);
      });
      this.$el.find('tbody').html(fragment);
      return this;
    },
    
    getPreviousPage: function(ev) {
      if (this.refs.filtered_products.state.currentPage > 0) {
        this.refs.filtered_products.getPreviousPage();
      }
      return false;
    },

    getNextPage: function(ev) {
      var state = this.refs.filtered_products.state;
      if (state.currentPage + 1 < state.totalPages) {
        this.refs.filtered_products.getNextPage();
      }
      return false;
    },

    filterProductsByTags: function() {
      var tag_ids = this.refs.selected_tags.pluck('_id');
      // Filter products by tags
      var products = this.collection.filter(function(product) {
        if (!tag_ids.length) {
          var tags = product.get('tags');
          return _.isArray(tags) && tags.length;
        }
        var temp_tag_ids = tag_ids.filter(function(tag_id) {
          return _.contains(product.get('tags'), tag_id);
        });
        // Filter product if all of the selected tags exist in the product's
        // tags array
        return temp_tag_ids.length == tag_ids.length;
      });
      this.refs.filtered_products.state.currentPage = 0;
      this.refs.filtered_products.fullCollection.reset(products);
    },
    
    filterProductsByCategory: function() {
      var obj                  = this,
          selected_category    = this.refs.selected_categories.at(0),
          selected_category_id = selected_category ? selected_category.id : null;
      var products = this.collection.filter(function(product) { 
        return _.some(product.get('categories'), function(id) {
          var category = obj.refs.product_categories.findWhere({ _id: id });
          if (!category) {
            return;
          }
          // Include all products if no selected category exists
          return (!selected_category_id || (category.id == selected_category_id)); 
        });
      });
      this.refs.filtered_products.state.currentPage = 0;
      this.refs.filtered_products.fullCollection.reset(products);
      return false;
    },

    add: function(ProductAdminView) {
      var view = new ProductAdminView({
        model:              this.model,
        refs:               this.refs,
        mode:               'add'
      });
      view.renderModal();
      var obj = this;
      // Add to collection if save is successful
      this.listenTo(view, 'save', function(model) {
        obj.collection.add(model);
      });
      return false;
    }


  });
  
});
