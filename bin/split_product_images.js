/**
 * 
 */

'use strict';

var async            = require('async'),
    db               = require('../models'),
    fs               = require('fs'),
    _                = require('underscore');

var image_dir = __dirname + '/../public/images/products/',
    thumb_dir = __dirname + '/../public/images/products/thumbnails/';

async.waterfall([
  function(next) {
    db.connection.model('Product').find({}, function(err, products) {
      if (err) {
        return next(err);
      }
      async.eachSeries(products, function(product, cb) {
        if (product.thumbnail) {
          fs.rename(image_dir + product.thumbnail, thumb_dir + product.thumbnail, function(err) {
            if (err) {
              console.error(err);
            }
            cb();
          });
          return;
        }
        cb();
      }, next);
    });
  }
], function(err) {
  if (err) {
    return console.error(err);
  }
  console.log('Done');
  db.connection.close();
});


