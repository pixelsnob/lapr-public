
var Product          = require('./models/product'),
    ProductCategory  = require('./models/product_category'),
    Maker            = require('./models/maker'),
    async            = require('async'),
    _                = require('underscore');

module.exports = function(app) {

  return {
    
    getProducts: function(req, res, next) {
      async.waterfall([
        // Get selected category, if any
        function(cb) {
          ProductCategory.findOne({ slug: req.params.category }, function(err, category) {
            if (err) {
              return cb(err);
            }
            cb(null, category);
          });
        },
        // Get products
        function(category, cb) {
          var query = {},
              opts  = { sort: { name: 1 } };
          if (category) {
            query.categories = category._id;
          }
          Product.search(query, opts, req.body.search, function(err, products) {
            if (err) {
              return cb(err);
            }
            cb(null, category, products);
          });
        },
        // Get product categories
        function(category, products, cb) {
          ProductCategory.find(function(err, categories) {
            if (err) {
              return cb(err);
            }
            cb(null, category, products, categories);
          });
        }

      ], function(err, category, products, categories, makers) {
        if (err) {
          return next(err);
        }
        res.render('products', {
          products:      products,
          categories:    categories,
          search:        (req.body.search || '')
        });
      });
    },

    getProduct: function(req, res, next) {
      Product.findOne({ slug: req.params.slug }, function(err, product) {
        if (err) {
          return next(err);
        }
        if (!product) {
          return next(new Error('Product not found'));
        }
        res.render('product', { product: product });
      });
    }
  };
};
