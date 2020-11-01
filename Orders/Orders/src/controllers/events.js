module.exports = function(app)
{
    app.post('/api/events',
        async function(req, res, next)
        {
            //Our events will still be posted into here in case we decided to publish events via an external service.

            res.statusCode = 200;
            res.send();
        });
}