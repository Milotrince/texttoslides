if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:'./.env'})
module.exports = require('knex')(require('../knexfile')[process.env.NODE_ENV])