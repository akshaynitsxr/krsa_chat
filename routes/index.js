const express = require('express')
const router = express.Router()
const https = require('https')
var OAuth = require('oauth')

// var clientId = '469635ab39aa6f711f22'
// var clientSecret = '2405b44083ab54cf756aae077acdfdb4a2733af3'

var oauth = new OAuth.OAuth2('469635ab39aa6f711f22',
    '2405b44083ab54cf756aae077acdfdb4a2733af3',
    'https://github.com',
    'login/oauth/authorize',
    'login/oauth/access_token',
    null)

router.get('/', function(req, res, next) {
    res.render('index')
})

router.post('/', function(req, res, next) {
    // console.log("kuch to hua hai")
    // var options = {
    //     host: 'https://github.com',
    //     path: '/login/oauth/authorize?',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': Buffer.byteLength(data)
    //     }
    // };

    // https.post('')
    // oauth.getOAuthAccessToken('', { 'grant_type': 'authorization_code' }, function(e, access_token, refresh_token, results) {
    //     console.log('bearer: ', access_token);
    // })
    // res.render('dashboard')

    res.render("https: //github.com/login/oauth/authorize?client_id=469635ab39aa6f711f22&redirect_uri=http://localhost:8001/dashboard/&response_type=code&scope=user");
})

module.exports = router