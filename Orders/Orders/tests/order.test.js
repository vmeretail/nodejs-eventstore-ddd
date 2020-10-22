// tests/order.test.js

const mongoose = require('mongoose');

const dbHandler = require('./db-handler');
const orderService = require('../src/services/order');
const orderModel = require('../src/models/order');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Order test suite.
 */
describe('order ', () => {
    it('can be created correctly', async () => {
        expect(async () => await orderService.create(orderComplete))
            .not
            .toThrow();
    });
});


const orderComplete = {
    id: 1,
    description: 'Test Order 1'
};