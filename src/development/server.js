const express = require('express');
const expressProxy = require('express-http-proxy');
const app = express();

const { resolve } = require('path');

app.use(express.static('src/main/resources/public/'));

app.use('/api', expressProxy(
    'localhost', {
        proxyReqPathResolver: (req) => {
            // console.log('/v1' + require('url').parse(req.url).path);
            return '/api' + require('url').parse(req.url).path;
        }
    })
);

app.get('*', (req, res) => {
	res.sendFile(resolve(__dirname, '../', 'main/resources/public/index.html'));
});

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});