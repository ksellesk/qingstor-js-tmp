var http = require('http');
var auth = require('./auth');

function SendRequest (method, path, headers, params) {
    var options = {
        hostname: 'bucketname.pek3a.qingstor.com',
        port: 80,
        method: method,
        path: path,
        headers: headers
    };

    var req = http.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            process.stdout.write(d);
        });
    });

    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}

method = "GET";
authpath = "/bucketname";
path = "/"
headers = {};
params = {};
headers["Date"] = new Date().toUTCString();

signature = auth.GenSignature(method, authpath, headers, params);
authorization = auth.GenAuthorization(signature);
headers["Authorization"] = authorization;
console.log(headers);
SendRequest(method, path, headers, params);
