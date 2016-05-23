var http = require('http');
var auth = require('./auth');

function SendRequest (method, path, headers, params) {
    var options = {
        hostname: 'testbucket.pek3a.qingstor.com',
        port: 80,
        method: method,
        path: "/test.jpg",
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

method = "PUT";
authpath = "/testbucket/test.jpg";
headers = {};
params = {};
headers["Date"] = new Date().toUTCString();

signature = auth.GenSignature(method, authpath, headers, params);
authorization = auth.GenAuthorization(signature);
headers["Authorization"] = authorization;
console.log(headers);
SendRequest(method, authpath, headers, params);
