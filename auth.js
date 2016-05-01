var crypto = require('crypto');

AccessID = "YOURACCESSID";
AccessKey = "YOURACCESSKEY";

function GenAuthorization(signature) {
    authorization = "QS-HMAC-SHA256 " + AccessID + ":" + signature;
    return authorization;
}
exports.GenAuthorization = GenAuthorization;

function GenSignature(method, authpath, headers, params) {
    // Append method
    var stringToSign = "";
    stringToSign += method.toUpperCase();

    // Append Content-Type and Content-Md5
    var ContentType = headers['Content-Type'] || "";
    var ContentMD5 = headers['Content-MD5'] || "";
    stringToSign += "\n" + ContentType + "\n" + ContentMD5;

    // Append time
    var dateStr = headers['X-QS-Date'] || "";
    if (!dateStr) {
        dateStr = params['X-QS-Date'] || "";
        if (dateStr) {
                stringToSign += "\n";
        }
    }
    if (!dateStr) {
        dateStr = headers['Date'] || "";
        if (!dateStr) {
            console.log("Error: Date not set");
        } else {
            stringToSign += "\n" + dateStr;
        }
    }

    // Generate canonicalized headers
    var signedHeaders = genSignedHeaders(headers);
    for (item in signedHeaders.sort()) {
        stringToSign += "\n" + item.toLowerCase() +":" + headers[item];
    }

    // Generate canonicalized resource
    var canonicalizedQuery = genCanonicalizedQuery(params);
    var canonicalizedResource = authpath;
    if (canonicalizedQuery) {
        canonicalizedResource += "?" + canonicalizedQuery;
    }
    stringToSign += "\n" + canonicalizedResource;
    console.log(stringToSign)
    signature = crypto.createHmac('sha256', AccessKey).update(
                stringToSign).digest().toString('base64').trim();
    return signature;

}
exports.GenSignature = GenSignature;

function genSignedHeaders(headers) {
    var signedHeaders = [];
    for (var key in headers) {
        if (key.toLowerCase().indexOf('x-qs-') === 0) {
            signedHeaders.push(headers[key]);
        }
    }
    return signedHeaders;
}

function genCanonicalizedQuery(params) {
    var canonicalizedQuery = "";
    for (var key in params) {
        if (canonicalizedQuery) {
            canonicalizedQuery += "&";
        }
        canonicalizedQuery += encodeURIComponent(key);
        if (params[key]) {
            canonicalizedQuery += "=" + encodeURIComponent(params[key]);
        }
    }
    return canonicalizedQuery;
}
