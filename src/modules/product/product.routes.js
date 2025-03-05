const { Router } = require('express');
const { createProductValidation } = require('./product.validation');
const {
 createProductHandler,
 getProductsHandler,
 getProductDetailsHnadler,
 deleteProductHandler,
} = require('./product.service');

const router = Router();

router.post('/create', createProductValidation, createProductHandler);
router.get('/', getProductsHandler);
router.get('/:id', getProductDetailsHnadler);
router.delete('/:id', deleteProductHandler);

module.exports = router;
