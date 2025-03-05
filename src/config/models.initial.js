const { Product, ProductDetail, ProductColor, ProductSize } = require('../modules/product/product.model');
const { User, Otp } = require('../modules/user/user.model');
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

 // User and Otp associations
 User.hasOne(Otp, { foreignKey: 'userId', as: 'otp', sourceKey: 'id' });
 Otp.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

 await sequelize.sync({ alter: true });
}

module.exports = {
 initDatabase,
};
