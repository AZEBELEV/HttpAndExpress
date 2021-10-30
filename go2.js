// этот файл надо будет дописать...
// не обращайте на эту функцию внимания 
// она нужна для того чтобы правильно читать входные данные
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
    let item = httpArr[i];
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
console.log(JSON.stringify(http, undefined, 2));