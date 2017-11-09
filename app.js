require('use-strict')
const express = require('express')
const app = module.exports = express()
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')
const winston = require('winston')
global.config = require('./config')
const cookieParser = require('cookie-parser')


var http = require('http').Server(app);
let io = require('socket.io')(http)

app.locals.appTitle = config.appTitle
app.locals.env = config.environment
// middleware
app.use(express.static(path.join(__dirname, '/public')))

// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'jade')


app.use(favicon((path.join(__dirname, '/public/favicon (1).ico'))))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())

app.use('development', function() {
    app.use(express.errorHandler())
})
/*
    @self-learning
    export should be done before importing
    as first we are importing the file which was already using the exported shit
*/

app.io = io

// setting up the routes
const dashboard = require('./routes/dashboard')
const index = require('./routes/index')
const loading = require('./routes/loading')
app.use('/dashboard', dashboard)
app.use('/', index)
app.use('/loading', loading)

// setting up the logger
winston.setLevels(winston.config.npm.levels)
winston.addColors(winston.config.npm.colors)
const logDir = config.logDir
if (!fs.existsSync(logDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDir)
}
logger = new(winston.Logger)({
    transports: [
        new winston.transports.Console({
            colorize: true
        }),
        new winston.transports.File({
            level: app.get('env') === 'development' ? 'debug' : 'info',
            filename: logDir + '/logs.log',
            maxsize: 1024 * 1024 * 10 // 10MB
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'log/exceptions.log'
        })
    ]
})

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('NOT FOUND')
    err.status = 404
    logger.error('Route not defined')
    logger.error(req.url)
    // next(err);
    return res.redirect('/') // redirects to home page in case of a 404
})

// server starts here
// can be accessed at localhost:port
http.listen(config.port, function() {
    logger.info('server is started at ', config.port)
})

// printing stack trace in case of error in development
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// printing stack trace in case of production
// no stack trace is revealed to the user

app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})