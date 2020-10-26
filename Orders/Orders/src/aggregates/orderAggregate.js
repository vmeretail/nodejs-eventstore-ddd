var uuid = require('uuid');
const aggregateHelper = require('./aggregate');
var esClient = require('node-eventstore-client');

module.exports.createOrder = createOrder;
module.exports.getLatest = getLatest;
module.exports.saveChanges = saveChanges;

function createOrder(aggregate, organisationId, storeId)
{
    if (aggregate.isCreated)
        return; //silently handle

    var event = {
        organisationId: organisationId,
        storeId: storeId,
        eventType: 'orderCreatedEvent',
        orderId : aggregate.aggregateId,
        eventId: uuid.v4()
    };

    applyAndAppend(aggregate, event);
};


function playEvent(aggregate, event) {

    //TODO: maybe a smarter way to achieve this?
    if (event.eventType === 'orderCreatedEvent') {
        aggregate.organisationId = event['organisationId'];
        aggregate.storeId = event['storeId'];
        aggregate.orderId = event["orderId"];
        aggregate.aggregateType = "order";
        aggregate.isCreated = true;
    }
}

function applyAndAppend(aggregate, pendingEvent) {
    if (aggregateHelper.isEventDuplicate(aggregate, pendingEvent.eventId))
        return;

    playEvent(aggregate, pendingEvent); //TODO going to have fun moving this into a shared file...
    aggregate.pendingEvents[pendingEvent.eventId] = pendingEvent;
}

function apply(aggregate, historicEvent) {
    aggregate.version = historicEvent.eventNumber;

    //Check for existing event
    if (aggregate.eventHistory[historicEvent.eventId])
        return;

    //TODO: Either we include this in the actual aggregate (i.e.a copy of this per aggregate) or make this a callback
    playEvent(aggregate, historicEvent);

    aggregate.eventHistory[historicEvent.eventId] = historicEvent;
}

//TODO: Work out where this lives (apply will cause the problem)
async function getLatest(aggregateId, conn) {
    var aggregate = aggregateHelper.createAggregate(aggregateId,"order"); //curried function for aggregate type?

    var streamName = aggregateHelper.getStreamName(aggregate);

    var result = await conn.readStreamEventsForward(streamName, 0, 200, true, null);

    if (result.events && result.events.length > 0) {
        var i;
        for (i = 0; i < result.events.length; i++) {
            var event = result.events[i].event;

            //TODO: likely break this out into function(s)

            var json = event.data.toString('utf8', 0, event.data.length);
            var domainEvent = JSON.parse(json);

            domainEvent['eventId'] = event.eventId;
            domainEvent['eventNumber'] = event.eventNumber;
            domainEvent['eventType'] = event.eventType;

            apply(aggregate, domainEvent);
        };
    }

    return aggregate;
}

async function saveChanges(aggregate, conn) {

    //TODO: probably breakout into a function
    if (Object.keys(aggregate.pendingEvents).length === 0) {
        return;
    }

    var eventData = [];

    var objectArray = Object.entries(aggregate.pendingEvents);

    objectArray.forEach(([key, value]) => {

        var eventId = value.eventId;
        var eventType = value.eventType;

        delete value.eventId;
        delete value.eventType;

        var event = esClient.createJsonEventData(eventId,
            value,
            null,
            eventType);

        eventData.push(event);
    });

    console.log("Appending...");

    var streamName = aggregateHelper.getStreamName(aggregate);

    //TODO; Version number hookup

    conn.appendToStream(streamName, esClient.expectedVersion.any, eventData)
        .then(function (result) {
            //console.log("Stored event:", eventId);
            console.log("Look for it at: http://localhost:2113/web/index.html#/streams/" + streamName); //TODO:
        })
        .catch(function (err) {
            console.log(err);
        });
}

