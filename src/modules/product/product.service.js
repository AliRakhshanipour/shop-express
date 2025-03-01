const createHttpError = require('http-errors');
const { ProductTypes } = require('../../common/product/product.enum');
const { Product, ProductDetail, ProductColor, ProductSize } = require('./product.model');
const { StatusCodes } = require('http-status-codes');

async function createProductHandler(req, res, next) {
 const transaction = await Product.sequelize.transaction();
 try {
  const { title, description, type, price, discount, active_discount, count, details, colors, sizes } = req.body;

  if (!Object.values(ProductTypes).includes(type)) {
   throw createHttpError(StatusCodes.BAD_REQUEST, 'Invalid product type');
  }

  const product = await Product.create(
   {
    title,
    description,
    price,
    count,
    discount,
    active_discount,
    type, // Ensure type is stored
   },
   { transaction }
  );

  if (details?.length) {
   const detailsList = details.map(item => ({
    key: item?.key,
    value: item?.value,
    productId: product.id,
   }));
   await ProductDetail.bulkCreate(detailsList, { transaction });
  }

  if (type === ProductTypes.Colored && colors?.length) {
   const colorList = colors.map(item => ({
    color_name: item?.name,
    color_code: item?.code,
    productId: product.id,
    price: item?.price,
    discount: item?.discount,
    active_discount: item?.active_discount,
    count: item?.count,
   }));
   await ProductColor.bulkCreate(colorList, { transaction });
  }

  if (type === ProductTypes.Sized && sizes?.length) {
   const sizeList = sizes.map(item => ({
    size: item?.size,
    productId: product.id,
    price: item?.price,
    discount: item?.discount,
    active_discount: item?.active_discount,
    count: item?.count,
   }));
   await ProductSize.bulkCreate(sizeList, { transaction });
  }

  await transaction.commit();
  return res.status(StatusCodes.CREATED).json({ success: true, product });
 } catch (error) {
  await transaction.rollback();
  console.error('Error creating product:', error);
  next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create product'));
 }
}

module.exports = {
 createProductHandler,
};
