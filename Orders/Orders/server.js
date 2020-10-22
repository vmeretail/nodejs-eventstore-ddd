var express = require('express');
var app = express();

module.exports = app;

const port = 1338;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

const mongoose = require('mongoose');

/**
 * Product model schema.
 */
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

module.exports = mongoose.model('product', productSchema);

// src/services/product.js

const productModel = require('../models/product');

/**
 * Stores a new product into the database.
 * @param {Object} product product object to create.
 * @throws {Error} If the product is not provided.
 */
module.exports.create = async (product) => {
    if (!product)
        throw new Error('Missing product');

    await productModel.create(product);
}

//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);

app.post('/order', function (req, res, next) {
    res.statusCode = 201;
    res.send('order id');
});




/*
 * Order Aggregate 
 * Eventstore code
 * Unit tests
 * REST
 *  POST Order / Order Items
 * Read model (mongoose?)
 *  GET - (should we build a simple read model)
 *  Subscription Service hookup for read model
 * Command Handler
 * Event handler
 */