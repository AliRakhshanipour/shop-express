const { Product, ProductDetail, ProductColor, ProductSize } = require('../modules/product/product.model');
const sequelize = require('./sequelize.config');

async function initDatabase() {
 Product.hasMany(ProductDetail, {
  foreignKey: 'productId',
  as: 'details',
  onDelete: 'CASCADE',
  hooks: true,
 });

 ProductDetail.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
 });

 Product.hasMany(ProductColor, {
  foreignKey: 'productId',
  as: 'colors',
  onDelete: 'CASCADE',
 });

 ProductColor.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
 });

 Product.hasMany(ProductSize, {
  foreignKey: 'productId',
  as: 'sizes',
  onDelete: 'CASCADE',
 });

 ProductSize.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
 });

 await sequelize.sync({ alter: true }); // Use alter instead of force
}

module.exports = {
 initDatabase,
};
