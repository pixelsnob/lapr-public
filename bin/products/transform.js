
'use strict';

var mongoose         = require('mongoose'),
    db               = mongoose.connect('mongodb://localhost/lapr'),
    async            = require('async'),
    ProductModel     = require('../../models/products'),
    TempProductModel = require('../../models/temp_products'),
    _                = require('underscore'),
    path             = require('path');

db.connection.on('error', function(e) {
  console.error('Mongo error: ' + e);
  process.exit(1);
});

var pages = [], c = 0;

async.waterfall([
  function(next) {
    var c = 0;
    TempProductModel.find({}, function(err, products) {
      if (err) {
        return next(err);
      }
      async.each(products, function(product, cb) {
        if (product.sizes) {
          product.sizes = product.sizes.replace(/(\d+(?:\.\d+)?)"?\s?x\s?(\d+(?:\.\d+)?)"?/gi, '$1x$2"');
        }
        if (product.maker) {
          product.maker = product.maker.split('/').map(function(m) {
            return m.replace(/^\s?([^\s]+)\s?$/, '$1');
          }).join(',');
        }
        product.save(function(err) {
          if (err) {
            return next(err);
          }
          cb();
        });
      }, function(err) {
        next(err);
      });
    });
  }
], function(err) {
  console.log('Done');
  db.connection.close();
});


