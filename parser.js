var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var unzip = zlib.createUnzip();

var target_file = "company.idx";
var path_root = 'cache';
var files = []; //relative to path_root, like '2011/QTR3/company.idx'
var parse_funcs = [];

console.log('start parsing...');

do {
  var rel_path = files.shift();
  var curr_path = path.resolve(path_root,rel_path);
  var curr_fs = fs.statSync(curr_path);
  if (curr_fs.isDirectory()) {
    var subfiles = fs.readdirSync(curr_path);
    for (var i = 0 ; i < subfiles.length ; i++) {
      files.push(path.resolve(curr_path,subfiles[i]));
    }
  } else if (curr_fs.isFile() && path.basename(curr_path) == target_file) {

    parse_funcs.push(function (to_parse) {
      return function() {
        console.log('parsing: '+to_parse+' is done!');
      }
    }(curr_path));
  }
} while (files.length>0);

for (var i = 0 ; i < parse_funcs.length; i++) { parse_funcs[i](); }

console.log('All executed!');
