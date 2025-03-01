const { Router } = require('express');
const { createProductValidation } = require('./product.validation');
const { createProductHandler, getProductsHandler, getProductDetails } = require('./product.service');

const router = Router();

router.post('/create', createProductValidation, createProductHandler);
router.get('/', getProductsHandler);
router.get('/:id', getProductDetails);

module.exports = router;
