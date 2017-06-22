var express = require('express');
var router = express.Router();

// Require our controllers
var productController = require('../controllers/productController');

/// PRODUCT ROUTES ///

router.get('/', productController.product_list);
router.post('/', productController.product_list);



router.get('/:id/edit', isloggedIn, productController.product_edit_get);
router.post('/:id/edit', isloggedIn, productController.product_edit_post);

router.get('/:id/detail', isloggedIn, productController.product_detail_get);

router.get('/:id/delete', productController.product_delete_get);
router.post('/:id/delete', productController.product_delete_post);

router.get('/add', isloggedIn,function(req,res,next){
  res.render('shop/add',{});
});
router.post('/add', isloggedIn ,productController.product_insert);

router.get('/edit',function(req,res,next){
  res.render('shop/edit',{});
});

router.get('/delete',function(req,res,next){
  res.render('shop/delete',{});
});

module.exports = router;

function isloggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}
