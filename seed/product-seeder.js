var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/250px-Gothiccover.png',
    title: 'Gothic Video Game',
    description: 'Awesome Game!!!',
    price: 10,
    type: 'Action',
    publisher: 'Egmont Interactive'
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/vi/thumb/5/56/Warcraft_Teaser_Poster.jpg/280px-Warcraft_Teaser_Poster.jpg',
    title: 'Warcraft Video Game',
    description: 'Awesome Game!!!',
    price: 20,
    type: 'MOBA',
    publisher: 'Blizzard Entertainment'
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/vi/thumb/3/32/Minecraft_logo.svg/280px-Minecraft_logo.svg.png',
    title: 'Minecraft Video Game',
    description: 'Awesome Game!!!',
    price: 15,
    type: 'Sandbox',
    publisher: 'Mojang'
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Dark_souls_3_cover_art.jpg/250px-Dark_souls_3_cover_art.jpg',
    title: 'Dark Souls III Video Game',
    description: 'Awesome Game!!!',
    price: 50,
    type: 'Action',
    publisher: 'Bandai Namco Entertainment'
  }),
];
var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if(done === products.length){
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
