var url = require('url');
var request = require('request');

var username;
var password;
var token;

var auth = function (name, pass) {
  username = name;
  password = pass;
}

var isInitialized = function() {
  if (!username) {
    return false;
  }
  return true;
}

var getAudioURL = function(text, voice, callback) {
  if (!token) {
    getToken(function(body) {
      token = body;
      var url = generateAudioURL(text, voice);
      callback(url);
    });
  } else {
    var url = generateAudioURL(text, voice);
    callback(url);
  }
}

var getToken = function(callback) {
  var urlString = 'https://' + username + ':' + password + '@stream.watsonplatform.net/authorization/api/v1/token' + url.format({
    query: {
      url: 'https://stream.watsonplatform.net/text-to-speech/api'
    }
  })

  request.get(urlString, function(err, res, body) {
    if (err) {
      console.log(err.message);
      return;
    }
    callback(body);
  });
}

var generateAudioURL = function (text, voice) {
  return 'https://' + username + ':' + password + '@stream.watsonplatform.net/text-to-speech/api/v1/synthesize' + url.format({
    query: {
      text: text,
      accept: 'audio/mp3',
      voice: voice || 'en-US_MichaelVoice'
    }
  }) + '&watson-token=' + token;
}

exports.auth = auth;
exports.getAudioURL = getAudioURL;
exports.isInitialized = isInitialized;
