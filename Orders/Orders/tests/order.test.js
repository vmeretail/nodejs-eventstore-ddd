const mongoose = require('mongoose');
var uuid = require('uuid');
const dbHandler = require('./db-handler');
const orderService = require('../src/services/order');
const orderAggregate = require('../src/aggregates/order');


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
describe('order readmodel', () => {
    it('can be created correctly', async () => {
        expect(async () => await orderService.create(orderComplete))
            .not
            .toThrow();
    });
});

describe('order aggregate', () => {
    it('can be created correctly', () =>
    {
        var aggregate = orderAggregate.createAggregate('C4B1557E-C4EB-44CF-808D-3319D36E1327', 'Order');


        var organisationId = "6e7eadde-b84f-4a64-b287-2b98d805a958";
        var storeId = "3218997a-a546-41ae-add6-88899e28bb73";
        var eventId = uuid.v4();
        var orderId = 1;

        orderAggregate.createOrder(aggregate, organisationId, storeId, orderId, eventId);

        //expect(async () => await orderService.create(orderComplete))
        //    .not
        //    .toThrow();
    });
});


const orderComplete = {
    id: 1,
    description: 'Test Order 1'
};