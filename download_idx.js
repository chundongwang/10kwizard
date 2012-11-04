var Ftp = require("jsftp");
var fs = require("fs");
var path = require("path");

// Initialize some common variables
var ftp = new Ftp({
    host: "ftp.sec.gov",
    user: "anonymous",
    port: 21, // The port defaults to 21
    pass: "a@b.c"
});

var year_start = 2010;
var year_count = 3;
var path_root = 'cache';
var target_file = 'company.zip';
var download_funcs = [];
var cached_count = 0;

console.log('start downloading index files...');

for (var i = 0 ; i < year_count ; i++) { // Year
  var path_year = path.resolve(path_root, ''+(year_start+i));
  if (!fs.existsSync(path_year)) fs.mkdirSync(path_year);

  for (var j = 0 ; j < 4 ; j++) { // Quater
    var path_qtr = path.resolve(path_year, 'QTR'+(j+1));
    if (!fs.existsSync(path_qtr)) fs.mkdirSync(path_qtr);

    // generating target
    var remote_path = "/edgar/full-index/"+(year_start+i)+"/QTR"+(j+1)+"/"+target_file;

    download_funcs.push(function (local,remote){
      return function() {
        console.log('Downloading '+remote+' to '+local+'...');
        ftp.get(remote, function(err, data) {
          if (err) console.error(err);
          if (Buffer.isBuffer(data)) {
            console.log('content length:'+data.length);
            fs.writeFileSync(local,data);
            console.log(remote+' cached!');
            if (++cached_count >= year_count*4) {
              ftp.raw.quit(function(err, res) {
                if (err) console.error(err);
                console.log("FTP session finalized! See you soon!");
              });
            }
          } else {
            console.log(data);
            cached_count++;
          }
        });
      }
    }(path.resolve(path_qtr,target_file),remote_path));

  }
}

download_funcs.forEach(function(func){func();});

console.log('All executed!');
