
var field_map = [
  { maker: 1, description: 2 },
  { maker: 1, description: 2, model_no: 3, price: 4 },
  { description: 1, price: 2 },
  { size: 1, maker: 2, description: 3 },
  { maker: 1, description: 2, price: 3 },
  { description: 1, maker: 2, price: 3 }
];

module.exports = {
  'chromatic.html': {
    name: 'Chromatic',
    fields: field_map[1] 
  },
  'mallets.html': {
    name: 'Mallets',
    fields: field_map[1] 
  },
  'accessories.html': {
    name: 'Accessories',
    fields: field_map[1] 
  },
  'backline.html': {
    name: 'Backline',
    fields: field_map[2] 
  },
  'concert_drums.html': {
    name: 'Concert Drums',
    fields: field_map[1] 
  },
  'ethnicdrums.html': {
    name: 'Ethnic Drums',
    fields: field_map[1] 
  },
  'drums.html': [
    {
      name: 'Drum Sets',
      fields: field_map[4]
    }, {
      name: 'Snare Drums',
      fields: field_map[3]
    }, {
      name: 'Misc. Drums',
      fields: field_map[0]
    }
  ],
  'erc.html': {
    name: 'Emil Richards Collection',
    fields: field_map[5]
  }
};
