/** require dependencies */
const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
var session = require('express-session')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var passport = require('passport')
const fs = require('fs')
var flash = require('connect-flash')
const path = require('path')
const rfs = require('rotating-file-stream')
const app = express()
var router = express.Router()
const url = "mongodb://aliatwa:159951ali@ds137605.mlab.com:37605/poster" || process.env.MONGODB_URI || "mongodb://localhost:27017/medium"
var Agenda = require('agenda');
mongoose.Promise = require('bluebird');
/** connect to MongoDB datastore */
try {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(db => {
        //use some connection with mongoose.
        let agenda = new Agenda().mongo(db.connection, 'schedules');
        agenda.on('ready', function (e) {
        })
    })
} catch (error) {
    console.log(error);
}
 
let port = 5000 || process.env.PORT
 
const logDir = path.join(__dirname, 'log')
fs.existsSync(logDir) || fs.mkdirSync(logDir)
const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDir
})
/** set up middlewares */
app.use(cors())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(helmet())

// required for passport

require('./config/passport')(passport);
app.use(session({
    secret: 'ibfdvfkjhdf',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var routes = require('./routes/')(router, passport)
app.use('/', routes);
//require('./routes/user')(passport);
//app.use('/static',express.static(path.join(__dirname,'static')))

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});