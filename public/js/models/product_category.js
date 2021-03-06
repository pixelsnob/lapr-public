/**
 * product_category model
 * 
 */
define([
  './base'
], function(BaseModel) {
  return BaseModel.extend({
    
    url: function() { return '/api/categories/' + (this.id || '') },

    initialize: function(opts) {
      
    },

    toString: function() {
      return this.get('name');
    }

  });
});
