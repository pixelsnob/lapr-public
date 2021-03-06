
'use strict';

var db = require('mongoose');

var ContentBlockSchema = new db.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true, enum: [ 'markdown' ] }
}, { collection: 'content_block' });

module.exports = mai => {
  ContentBlockSchema.plugin(mai.plugin, {
    model: 'ContentBlock',
    startAt: 1
  });
  return db.model('ContentBlock', ContentBlockSchema);
};

