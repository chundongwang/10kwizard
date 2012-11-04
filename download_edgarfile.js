//var Ftp = require("jsftp");
var fs = require("fs");
var path = require("path");
var util = require('util');
var events = require('events');
var Step = require('step');

/*
// Initialize some common variables
var ftp = new Ftp({
    host: "ftp.sec.gov",
    user: "anonymous",
    port: 21, // The port defaults to 21
    pass: "a@b.c"
});
*/

//console.log('start downloading edgar files...');

Step(
  function readSelf() {
    fs.readFile(__filename, this);
  },
  function capitalize(err, text) {
    if (err) throw err;
    console.log('text:'+util.inspect(text));
    return text.toUpperCase();
  },
  function showIt(err, newText) {
    if (err) throw err;
    console.log(newText);
  }
);

//console.log('All executed!');
