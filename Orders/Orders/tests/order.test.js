const mongoose = require('mongoose');
var uuid = require('uuid');
const dbHandler = require('./db-handler');
const orderService = require('../src/services/order');
const aggregateHelper = require('../src/aggregates/aggregate');
const orderAggregateHelper = require('../src/aggregates/orderAggregate');
var chai = require('chai');


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
        var aggregateId = '59ea9cd4-fc89-4b1d-a91e-335ef8b6eda6';
        var aggregate = aggregateHelper.createAggregate(aggregateId, 'Order');

        var organisationId = "6e7eadde-b84f-4a64-b287-2b98d805a958";
        var storeId = "3218997a-a546-41ae-add6-88899e28bb73";

        orderAggregateHelper.createOrder(aggregate, organisationId, storeId);

        chai.expect(aggregate.organisationId).to.equal(organisationId);
        chai.expect(aggregate.storeId).to.equal(storeId);
        chai.expect(aggregate.orderId).to.equal(aggregateId);
    });
});


const orderComplete = {
    id: 1,
    description: 'Test Order 1'
};