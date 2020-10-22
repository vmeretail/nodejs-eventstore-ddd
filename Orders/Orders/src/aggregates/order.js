module.exports.createOrder = (aggregate, organisationId, storeId, orderId, eventId) =>
{
    var event = {
        organisationId: organisationId,
        storeId: storeId,
        eventType: 'orderCreatedEvent',
        eventId: eventId,
        orderId: orderId
    };

    applyAndAppend(aggregate, event);
};

module.exports.createAggregate = (aggregateId, aggregateType) =>
{
    return {
        eventHistory: {},
        pendingEvents: {},
        version: -1,
        aggregateId: aggregateId,
        aggregateType: aggregateType
    };
};

function playEvent(aggregate, event) {

    //TODO: maybe a smarter way to achieve this?
    if (event.eventType === 'orderCreatedEvent') {
        aggregate.organisationId = event['organisationId'];
        aggregate.storeId = event['storeId'];
        //aggregate.salesTransactionId = event['salesTransactionId'];
        //aggregate.salesTransactionDateTime = event['salesTransactionDateTime'];
    }
}

function applyAndAppend(aggregate, pendingEvent) {
    if (isEventDuplicate(aggregate, pendingEvent.eventId))
        return;

    playEvent(aggregate, pendingEvent);
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



function isEventDuplicate(aggregate, eventId) {
    return aggregate.eventHistory[eventId] || aggregate.pendingEvents[eventId];
}