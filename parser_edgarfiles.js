var fs = require('fs');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

var host = 'localhost';
var port = Connection.DEFAULT_PORT;

console.log("Connecting to " + host + ":" + port);

var db = new Db('node-mongo-examples', new Server(host, port, {}), {native_parser:true});

