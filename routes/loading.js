const express = require('express')
const router = express.Router()
const https = require('https')
var OAuth = require('oauth')


router.get('/', function(req, res, next) {
    https.request('https://github.com/login/oauth/token?client_id=469635ab39aa6f711f22&client_secret=2405b44083ab54cf756aae077acdfdb4a2733af3&code=' + req.query.code + '&redirect_uri=http://localhost:8001/dashboard/&grant_type=authorization_code')
})

module.exports = router