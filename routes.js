
var Products = require('./models/temp_products'),
    async    = require('async');

module.exports = function(app) {

  return {
    
    getProducts: function(req, res, next) {
      async.waterfall([
        // Get products
        function(cb) {
          var query = req.query.category ?
                      { category: new RegExp(req.query.category) } : {};
          Products.find(query, null, { sort: { name: 1 }}, function(err, products) {
            if (err) {
              return cb(err);
            }
            cb(null, products);
          });
        },
        // Get product categories
        function(products, cb) {
          Products.find().distinct('category', function(err, categories) {
            if (err) {
              return cb(err);
            }
            categories = categories.filter(function(category) {
              return category.split(',').length == 1;
            });
            cb(null, products, categories);
          });
        },
        // Get makers
        function(products, categories, cb) {
          var ids = products.map(function(product) {
            return product._id;
          });
          Products.find({ _id: { $in: ids } }).distinct('makers', function(err, makers) {
            if (err) {
              return cb(err);
            }
            makers.sort();
            cb(null, products, categories, makers);
          });
        }
      ], function(err, products, categories, makers) {
        if (err) {
          return next(err);
        }
        res.render('products', {
          products:      products,
          categories:    categories,
          makers:        makers.join(', ')
        });
      });
    }
    
    
  };
};
