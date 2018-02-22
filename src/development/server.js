const express = require('express');
const expressProxy = require('express-http-proxy');
const app = express();

app.use(express.static('src/main/resources/public/'));

app.use('/api', expressProxy(
	'localhost', {
        proxyReqPathResolver: function(req) {
            // console.log('/v1' + require('url').parse(req.url).path);
            return '/api' + require('url').parse(req.url).path;
        }
    })
);

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/src/main/resources/public/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});