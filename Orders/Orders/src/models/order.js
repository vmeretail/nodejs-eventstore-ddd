'use strict';

//https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np

const mongoose = require('mongoose');

/**
 * Order model schema.
 */
const orderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('order', orderSchema);