'use strict';

const mongoose = require('mongoose');

const dbHandler = require('./db-handler');
const orderService = require('../src/services/order');
const orderModel = require('../src/models/order');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();
});

/**
 * Seed the database.
 */
beforeEach(async () => {
    await createOrders();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
    await dbHandler.clearDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await dbHandler.closeDatabase();
});


describe('order getById ', () => {
    it('should return null if nothing is found', async () => {
        await expect(orderService.getById(mongoose.Types.ObjectId()))
            .resolves
            .toBeNull();
    });

    it('should retrieve correct order if id matches', async () =>
    {
        const foundOrder = await orderService.getById(orderId1);

        expect(foundOrder.id).toBe(order1.id);
        expect(foundOrder.description).toBe(order1.description);
    });
});

/**
 * Seed the database with orders.
 */
const createOrders = async () => {
    const order = await orderModel.create(order1);
    orderId1 = order._id;
};

let orderId1;

const order1 = {
    id: 'E888EDE0-8A57-4D3B-A6DD-A0443A0A8CEE',
    description: 'Order 1'
};