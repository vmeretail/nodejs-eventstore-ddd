module.exports.getStreamName = getStreamName;
module.exports.isEventDuplicate = isEventDuplicate;
module.exports.createAggregate = createAggregate;

function getStreamName(aggregate) {
    return aggregate.aggregateType + "-" + aggregate.aggregateId.replace(/-/gi, "");
}

function isEventDuplicate(aggregate, eventId) {
    return aggregate.eventHistory[eventId] || aggregate.pendingEvents[eventId];
}

function createAggregate(aggregateId, aggregateType) {
    return {
        eventHistory: {},
        pendingEvents: {},
        version: -1,
        aggregateId: aggregateId.toLowerCase(),
        aggregateType: aggregateType
    };
};

//TODO: aggregateRepository.js