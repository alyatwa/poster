const Agenda = require('agenda');

const mongoConnectionString = 'mongodb://aliatwa:159951ali@ds137605.mlab.com:37605/poster';

// or override the default collection name: 
let agenda = new Agenda({
    db: {
        address: mongoConnectionString,
        collection: 'schedules'
    }, 
    options: {
        useNewUrlParser: true
    }
});
let jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];

jobTypes.forEach(function (type) {
    require('./jobs/' + type)(agenda);
});

if (jobTypes.length) {
    agenda.on('ready', function () {
        agenda.start();
    });
}

function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;