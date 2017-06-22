var Product = require('../models/product');

// Display list of all products
exports.product_list = function(req, res, next) {
  var keyword = req.query.q;
  console.log(keyword);
  if(!keyword){
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for(var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', product_list: productChunks });
      });
  }
  else{
    Product.find({"type": keyword},function (err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for(var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Shopping Cart', product_list: productChunks });
    });
  }

};
exports.search_list = function(req, res, next) {
  var type = req.params.type;
  Product.find({"type": keyword},function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', product_list: productChunks });
  }); 
};

exports.product_insert = function (req,res,next) {
    var product_instance = new Product({
        imagePath: req.body.imagePath,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        publisher: req.body.publisher
    });
    product_instance.save(function (err) {
       if (err){
           return;
       }
       res.redirect("/");
    });
};
exports.product_edit_get = function (req,res,next) {
    Product.findById(req.params.id,function (err,product) {
       if(err){
           return;
       }
       res.render('shop/edit',{
           product:product
       });
    });
};
exports.product_edit_post = function (req,res,next) {
    var product_instance = new Product({
        _id: req.params.id,
        imagePath: req.body.imagePath,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        publisher: req.body.publisher
    });
    Product.findByIdAndUpdate(req.params.id,product_instance,{},function (err,product) {
        if(err){
            return;
        }
        res.redirect("/");
    });

};

exports.product_detail_get = function (req,res,next) {
    Product.findById(req.params.id,function (err,product) {
        if(err){
            return;
        }
        res.render('shop/detail',{
            product:product
        });
    });
};

exports.product_delete_get = function (req,res,next) {
    res.render('shop/delete',{});
};

exports.product_delete_post = function (req,res,next) {
    Product.findByIdAndRemove(req.params.id, function deleteproduct(err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });

};
