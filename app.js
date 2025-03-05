const { config } = require('dotenv');
const express = require('express');
const sequelize = require('./src/config/sequelize.config');
const { initDatabase } = require('./src/config/models.initial');
const morgan = require('morgan');
const productRoutes = require('./src/modules/product/product.routes');
const { authRouter } = require('./src/modules/auth/auth.routes');
config();

async function main(params) {
 const app = express();
 await initDatabase();

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(morgan('dev'));
 app.use('/products', productRoutes);
 app.use('/auth', authRouter);

 app.use((req, res, next) => {
  return res.status(404).json({
   message: 'route not found',
  });
 });

 app.use((err, req, res, next) => {
  let status = err?.status ?? err?.statusCode ?? 500;
  let message = err?.message ?? 'internal server error';

  if (err?.name === 'ValidationError') {
   const { details } = err;
   message = details?.body?.[0]?.message ?? 'internal server error';
  }

  return res.status(status).json({
   message,
   err,
  });
 });

 const port = process.env.PORT ?? 3000;
 app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
 });
}

main();
