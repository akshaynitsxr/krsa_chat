const express = require('express')
const router = express.Router()
const fs = require('fs')
let xhr = require('xhr-request')
let query = require('qs')
var io = require('../app').io
var request = require('request')
var cheerio = require('cheerio')
var https = require('https')
var OAuth = require('oauth')

var clientId = '469635ab39aa6f711f22'
var clientSecret = '2405b44083ab54cf756aae077acdfdb4a2733af3'

var oauth = new OAuth.OAuth2('469635ab39aa6f711f22',
    '2405b44083ab54cf756aae077acdfdb4a2733af3',
    'https://github.com',
    'login/oauth/authorize',
    'login/oauth/access_token',
    null)

router.get('/', function(req, res, next) {
    res.render('dashboard')
})

router.post('/', function(req, res, next) {
    // oauth.getOAuthAccessToken('', {}, function(e, access_token, refresh_token, results) {
    //     console.log('bearer: ', results);
    // })
    res.render('dashboard')
})

io.on('connection', function(socket) {
    logger.info('a user connected')
    socket.on('chat message', function(msg) {
        const validUrl = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(msg.toString())
        const testGif = /\/gif\s\(([^.?]*)\)|\/gif\s\w+/g
        let matches = msg.match(testGif) || []
        if (validUrl)
            testurl(msg)
        else if (matches.length > 0)
            giphy(msg)
        else {
            var data = {
                msg: msg
            }
            io.emit('chat message', data);
        }
    })
    socket.on('disconnect', function() {
        logger.info('user disconnected')
    })
})

router.post('/', function(req, res, next) {
    res.send()
})
var giphy = function(text) {
    const apiKey = 'dc6zaTOxFJmzC'
    const apiUrl = 'http://api.giphy.com/v1/gifs/search'
    const regex = /\/gif\s\(([^.?]*)\)|\/gif\s\w+/g
    let textToAnalyze = text
    const matches = textToAnalyze.match(regex) || []
    const rets = []
    // matches.forEach((match) => {
    const queryParams = {
        api_key: apiKey,
        limit: 1,
        rating: 'g',
        // q: match.split('/gif')[1]
        q: matches[0].split('/gif')[1]
    }
    let url = apiUrl + '?' + query.stringify(queryParams)
    var rendering = ''
    request(url, function(error, response, body) {
        if (error) { logger.info(error) } else {
            var data = JSON.parse(body)
            if (data.data.length > 0) {
                logger.info(data.data[0]['id'])
                rendering = data.data[0]['id']
                // rendering = "https://i.giphy.com/" + rendering + ".gif"
                rendering = 'https://media0.giphy.com/media/' + rendering + '/giphy-downsized.gif'
                var data = {
                    rendering: rendering,
                    type: 'giphy',
                    msg: matches[0].split('/gif')[1]
                }
                io.emit('chat message', data)
            }
            // const body = JSON.parse(data.body || data);
        }
    })
    // });
    // return Promise.all(rets).then((values) => {
    //     request.message.gifs = values;
    //     request.message.text = textToAnalyze.replace(/\/gif\s\(([^.?]*)\)/g, '$1').replace(/\/gif\s/g, '');
    //     return request.ok();
    // });
}

var testurl = function(str) {
    str = str.toString()
    logger.info(str)
    var valid = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(str)
    if (!valid) {
        logger.info("hello")
        return false
    } else {
        https.request(str, function(response) {
            var request = this;
            var str1 = '';
            response.on('data', function(chunk) {
                str1 += chunk.toString('utf8');
                if (str1.length > 10000) {
                    request.abort();
                }
            });
            response.on('end', function() {
                const $ = cheerio.load(str1)
                var image_url = $('meta[property="og:image"]').attr('content')
                var title = $('title').html()
                var description = $('meta[property="og:description"]').attr('content')
                var data = {
                    image_url: image_url,
                    title: title,
                    description: description,
                    type: 'url',
                    msg: str
                }
                io.emit('chat message', data)
            });
        }).end();
    }
}

module.exports = router