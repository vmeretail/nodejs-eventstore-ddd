const orderModel = require('../models/order');

module.exports.create = async (order) => {
    if (!order)
        throw new Error('Missing order');

    await orderModel.create(order);
}


module.exports.getById = async (id) => {
    const order = await orderModel.findById(id);
    return order;
};