function readHttpLikeInput() {
  var fs = require("fs");
  var res = "";
  var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  let was10 = 0;
  for (; ;) {
    try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) { break; /* windows */ }
    if (buffer[0] === 10 || buffer[0] === 13) {
      if (was10 > 10)
        break;
      was10++;
    } else
      was10 = 0;
    res += new String(buffer);
  }
  return res;
}

let contents = readHttpLikeInput();

/**
 * functions print output http response in stated format
 * 
 * @param {*} statusCode 
 * @param {*} statusMessage 
 * @param {*} headers 
 * @param {*} body 
 */
function outputHttpResponse(statusCode, statusMessage, headers, body) {

  console.log(`HTTP/1.1 ${statusCode}
  Date: ${new Date}
  Server: Apache/2.2.14 (Win32)
  Content-Length: ${(statusMessage + "").length}
  Connection: Closed
  Content-Type: text/html; charset=utf-8

  ${statusMessage}`);
}


/**
 * function finds out statusCode and statusMessage for http response
 * 
 * @param {*} $method method of http request
 * @param {*} $uri url of http request 
 * @param {*} $headers headers of http request
 * @param {*} $body body of http request
 */
function processHttpRequest($method, $uri, $headers, $body) {
  let statusCode = "404 Not Found"
  let statusMessage = "not found";
  if ($method == "GET" && $uri.startsWith("/sum?nums=")) {

    statusMessage = $uri
      .slice($uri.indexOf("=") + 1)
      .split(",")
      .reduce((accumulator, current) => +accumulator + +current);

    statusCode = "200 OK";
  } else {
    if ($method != "GET" || ($uri.startsWith("/sum") && !$uri.startsWith("/sum?nums="))) {
      statusCode = "400 Bad Request"
    }
  }
  outputHttpResponse(statusCode, statusMessage);
}

/**
 * function transform http string to object
 * @param {} string http request
 * @returns object with properties of http request structure
 */
function parseTcpStringAsHttpRequest(string) {
  let httpArr = string.split("\n");
  let httpRequest = {};
  let headersMap = [];
  let body;
  httpRequest["method"] = httpArr[0].match(/[A-Z]+/)[0].trim();
  httpRequest["uri"] = httpArr[0].match(/\/[^\s]+/)[0].trim();           //
  for (let i = 1; i < httpArr.length; i++) {
    item = httpArr[i];
    if (item.includes(":")) {
      let divider = item.indexOf(":");
      headersMap.push([item.slice(0, divider).trim(), item.slice(divider + 1).trim()])
    } else {
      if (item != "") body = item.trim();
    }
  }
  httpRequest.headers = headersMap;
  httpRequest["body"] = body;

  return httpRequest;
}
http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);