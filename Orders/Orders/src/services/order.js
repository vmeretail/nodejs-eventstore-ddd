const orderModel = require('../models/order');
const orderReadModel = require('../../tests/db-handler'); //TODO sort out the path

module.exports.create = async (order) => {

    if (!order)
        throw new Error('Missing order');

    await orderReadModel.connect();

    var x = await orderModel.create(order, err => {
        if (err)
        {
            console.log(err);
            throw err;
        }
        console.log('Created');
    });
}


module.exports.getById = async (id) => {
    //TODO: This needs the original mongo id

    const order = await orderModel.findById(id);

    

    return order;
};

module.exports.getAll = async () => {
    const orders = await orderModel.find();

    return orders;
};