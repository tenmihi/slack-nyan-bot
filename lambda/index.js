const https = require('https')

const API_URL = "https://api.thecatapi.com/v1/images/search?format=json&mime_types=gif";

exports.handler = (slack_event, context, callback) => {
  const body = JSON.parse(slack_event.body);

  if (body.type === 'url_verification') {
      callback(null, { body: JSON.stringify(body) })
      return
  }
  if (body.subtype === 'bot_message') {
      callback(null, { body: "OK" })
      return
  }
  if (!body.event || !/にゃーん/.test(body.event.text)) {
      callback(null, { body: "Not supported" })
      return
  }

  https.get(API_URL, (res) => {
    res.setEncoding('utf8');
    res.on('data', (str) => {
      const data = JSON.parse(str);
      postToSlack (
        data[0].url, 
        body.event.channel, 
        process.env['BOT_USER_OAUTH_ACCESS_TOKEN'],
        () => { callback(null, { body: "done" }) }
      )
    });
  });
}

function postToSlack (message, channel, access_token, cb) {
  const data = JSON.stringify({
    token: access_token,
    channel: channel,
    text: message,
  })
  
  const options = {
    host: 'slack.com',
    port: 443,
    path: '/api/chat.postMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${access_token}`
    }
  }
  
  const req = https.request(options);
  
  req.on('error', (e) => { console.log(e.message) })
  req.write(data)
  req.end(() => { cb() })
}