var fs = require('fs');
var path = require('path');
var reader = require('buffered-reader');
var util = require('util');
var os = require('os');

var target_file = "company.idx";
var db_file = 'db.txt';
var path_root = 'cache';
var files = []; //relative to path_root, like '2011/QTR3/company.idx'
var parse_funcs = [];

var DEBUG_OPTION = false;

if (fs.existsSync(db_file)) {
  console.log('found existing database file: '+path.resolve(db_file));
  console.log('please rename it and retry '+__filename);
} else {
  console.log('start parsing...');

  var target_count = 0;
  do {
    var rel_path = files.shift();
    var curr_path = path.resolve(path_root,rel_path);
    var curr_fs = fs.statSync(curr_path);
    if (curr_fs.isDirectory()) {
      var subfiles = fs.readdirSync(curr_path);
      subfiles.forEach(function(subfile){
        files.push(path.resolve(curr_path,subfile));
      });
    } else if (curr_fs.isFile() && path.basename(curr_path) == target_file) {
      parse_funcs.push(function(to_parse) {
        return function () {
          var sep_content = /^[-]+$/;
          var content_found = false;
          var db = [];
          var line_progress = 0;
          new reader.DataReader(to_parse, {encoding:'utf8'})
            .on('error', function(err) {
              console.error(err);
            })
            .on('line', function(line, nextByteOffset) {
              if (!content_found) {
                if (sep_content.test(line)) {
                  content_found = true;
                }
              } else {
                if (/10-[QK]/i.test(line)) {
                  DEBUG_OPTION&&console.log(line);
                  var fields = [
                    line.substring(0,62).replace(/\s+$/,''),
                    line.substring(62,74).replace(/\s+$/,''),
                    line.substring(74,86).replace(/\s+$/,''),
                    line.substring(86,98).replace(/\s+$/,''),
                    line.substring(98,149).replace(/\s+$/,'')];
                  DEBUG_OPTION&&console.dir(fields);
                  if (/10-[QK]/i.test(fields[1])) {
                    db.push(fields[4]);
                    /*
                    // the path seperator is for ftp usage, don't use path.sep which is for local filesystem.
                    db.push(path.dirname(fields[4])+'/'+path.basename(fields[4],'.txt')+'.hdr.sgml');
                    */
                  }
                }
              }
              if (++line_progress%1000==0) {
                console.log(line_progress+' lines processed...');
              }
            })
            .on('end', function() {
              console.log('parsing: '+to_parse+' is done!');
              var out = fs.createWriteStream(db_file,{encoding:'utf8',flags:'a+'});
              db.forEach(function(e){
                out.write(e+os.EOL);
              });
              out.end();
              out.destroySoon();
              console.log('dumping: '+to_parse+' is done!');
              target_count--;
              if (target_count==0) {
                console.log('--------------------');
                console.log('Done!');
                console.log('--------------------');
              }
            })
            .read();
        }
      }(curr_path));
    }
  } while (files.length>0);

  target_count += parse_funcs.length;
  parse_funcs.forEach(function(func){func();});

  console.log('All executed!');
}
