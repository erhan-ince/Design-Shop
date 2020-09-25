const mongoose = require('mongoose');

//const { Schema } = mongoose;
const Schema = mongoose.Schema;

const itemSchema = new Schema(
     {
          product_name: {
               type: String,
               required: true,
          },
          Company: {
               type: String,
               required: true,
          },
          Price: {
               type: String,
               required: true,
          },
          product_picture_URL: {
               type: String,
               required: true,
          },
          link_shop: {
               type: String,
               required: true,
          },
     },
     { collection: 'Items' }
);

const item = mongoose.model('Items', itemSchema);

module.exports = item;
