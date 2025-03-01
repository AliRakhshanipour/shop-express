const { Router } = require('express');
const { createProductValidation } = require('./product.validation');
const { createProductHandler } = require('./product.service');

const router = Router();

router.post('/create', createProductValidation, createProductHandler);

module.exports = router;
