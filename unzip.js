var fs = require('fs');
var path = require('path');
var unzip = require('unzip');

var target_file = "company.zip";
var path_root = 'cache';
var files = []; //relative to path_root, like '2011/QTR3/company.zip'
var unzip_funcs = [];

console.log('start decompressing...');

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

    unzip_funcs.push(function (zip_file_path, unzip_target) {
      return function() {
        fs.createReadStream(zip_file_path).pipe(unzip.Extract({ path: unzip_target }));
        console.log('unzip: '+zip_file_path+' to '+unzip_target+' is done!');
      }
    }(curr_path, path.resolve(path.dirname(curr_path))));
  }
} while (files.length>0);

for (var i = 0 ; i < unzip_funcs.length; i++) { unzip_funcs[i](); }

console.log('All executed!');
