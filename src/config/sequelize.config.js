const { config } = require('dotenv');
const { Sequelize } = require('sequelize');
config();
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  logging: false,
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch(err => {
    console.log('can not connect to database');
    console.log(err);
  });

module.exports = sequelize;
