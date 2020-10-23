var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

module.exports = app;

const port = 1337;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

//TODO: Move this into an Order Controller
//TODO: Unit tests for REST functions

app.post('/api/order', function (req, res, next) {

    //TODO: REST  - is the POST purely for creating then the order then subsequent PUT?

    var order = req.body;

    res.statusCode = 201;
    res.send({
        id : 1
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