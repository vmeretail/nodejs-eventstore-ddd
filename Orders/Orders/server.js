var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var esClient = require('node-eventstore-client');
var uuid = require('uuid');


const orderAggregateHelper = require('./src/aggregates/orderAggregate.js');
const eventPublisher = require('./src/services/eventPublisher.js');

const orderReadModel = require('./src/services/order.js');

const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

module.exports = app;

const port = 1337;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

//TODO: make sure we only have 1 connection
//Add eventstore addess to config
var connSettings = {};  // Use defaults
var esConnection = esClient.createConnection(connSettings, "tcp://localhost:1113");
esConnection.connect();
esConnection.once('connected', function (tcpEndPoint) {
    console.log('Connected to eventstore at ' + tcpEndPoint.host + ":" + tcpEndPoint.port);
});

eventPublisher.start();

//TODO: Move this into an Order Controller
//TODO: Unit tests for REST functions
//TODO: Postman collection (with examples)

async function handleCommand(command) {
    //Eventually dispatch a command for this
    var orderAggregate = await orderAggregateHelper.getLatest(command.orderId, esConnection);

    orderAggregateHelper.createOrder(orderAggregate, command.organisationId, command.storeId);

    orderAggregateHelper.saveChanges(orderAggregate, esConnection);
}

app.post('/api/order', async function (req, res, next) {

    var createOrderCommand = {
        organisationId: req.body.organisationId,
        storeId:  req.body.storeId,
        orderId: req.body.orderId,
        commandI: uuid.v4()
    }

    //TODO: Will implement a command bus / handler.
    //TODO: verify what happens when an exception occus for a promise - suspect we are not handling it
    await handleCommand(createOrderCommand);

    res.statusCode = 201;
    res.send({
        orderId: createOrderCommand.orderId
    });
});

app.put('/api/order/:orderId', function (req, res, next) {

    //We handle updates to original order in here.
    //orderConfirmed
    //deliveredConfirmed

    var order = req.body;
    var orderId = req.params.orderId;

    res.statusCode = 200;
    res.send({
        id: 1
    });
});

app.post('/api/order/:orderId/item', function (req, res, next) {

    //TODO: REST  - is the POST purely for creating then the order then subsequent PUT?

    var order = req.body;
    var orderId = req.params.orderId;

    res.statusCode = 201;
    res.send({
        id: 1
    });
});

//TODO: first cut
function factory(event)
{
    return {
        orderId: event.id
    };
}

app.get('/api/order/', async function (req, res, next) {

    var orders = await orderReadModel.getAll();

    var j = orders.map(factory);

    res.statusCode = 200;
    res.send(j);
});

app.get('/api/order/:orderId', async function (req, res, next) {

    var orderId = req.params.orderId;

    var newId = mongoose.mongo.ObjectId(orderId);

    //TODO: I suspect we will keep an "orders controller, but the GET methods will branch off to the read model
    var order = await orderReadModel.getById(newId);

    res.statusCode = 200;
    res.send(order);
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