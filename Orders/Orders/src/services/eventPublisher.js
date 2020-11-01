const client = require("node-eventstore-client");
const resolveLinkTos = true;

const orderReadModel = require('./order.js');

function resumeEvent(event)
{
    return [
        event.originalEvent.eventType,
        [event.originalEventNumber.toNumber(), event.originalStreamId].join('@'),
        event.originalPosition
    ].join(" ");
}

const eventAppeared = async (subscription, event) =>
{
    console.log("Event received", resumeEvent(event));

    //console.log(event.eventId);
    console.log(event.event.data.toString());

    var domainEvent = JSON.parse(event.event.data.toString());

    //TODO: dispatch to event handler

    var orderModel = {
        id: domainEvent.orderId,
        description : 'test'
    }

    await orderReadModel.create(orderModel);

    //subscription.acknowledge(event);
}

const subscriptionDropped = (subscription, reason, error) => console.log("Subscription dropped", reason, error);


const credentials = new client.UserCredentials("admin", "changeit");

const settings = {};
const endpoint = "tcp://localhost:1113";
const connection = client.createConnection(settings, endpoint);


module.exports.start =  () => {

    //TODO: Configuration passed in
    connection.connect().catch(err => console.log("Connection failed", err));
    console.log('eventPublisher started');
}

connection.on('heartbeatInfo', heartbeatInfo =>
    console.log('Heartbeat latency', heartbeatInfo.responseReceivedAt - heartbeatInfo.requestSentAt, 'ms')
);

connection.once("connected", tcpEndPoint => {
    console.log(`Connected to eventstore at ${tcpEndPoint.host}:${tcpEndPoint.port}`);

    //TODO: configuration
    connection.connectToPersistentSubscription('$ce-order',
        'Orders',
        eventAppeared,
        subscriptionDropped,
        credentials,
        100,
        false);

});

connection.on("error",
    error =>
    console.log(`Error occurred on connection: ${error}`)
);

connection.on("closed", reason =>
    console.log(`Connection closed, reason: ${reason}`)
);