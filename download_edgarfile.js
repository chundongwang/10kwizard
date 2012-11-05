var Ftp = require("jsftp");
var fs = require("fs");
var path = require('path');
var os = require('os');
var util = require('util');

// Initialize some common variables
var ftp = new Ftp({
    host: "ftp.sec.gov",
    user: "anonymous",
    port: 21, // The port defaults to 21
    pass: "a@b.c"
});

var task_queue = [];
var local_cache_root = 'cache\\10kq';
var db_file = 'db.10kq.2010.2011.2012.txt';
var running_count = 0;
var max_parallel_count = 5;

//console.log('start downloading edgar files...');
function getSingleFile(remote_path) {
  running_count++;
  if (remote_path.length<=0 && task_queue.length>0) {
    getSingleFile(task_queue.pop());
    running_count--;
  } else {
    console.log('downloading '+remote_path);
    ftp.get(remote_path, function(err, data) {
      if (err) console.error(err);
      if (Buffer.isBuffer(data)) {
        //console.log('content length:'+data.length);
        fs.writeFile(path.resolve(local_cache_root,path.basename(remote_path)),data,'utf8',function(err){
          if (err) console.error(err);
          console.log(remote_path+' cached, content length: %d!', data.length);
        });
        if (task_queue.length>0) {
          getSingleFile(task_queue.pop());
        } else if (running_count==1) {
          ftp.raw.quit(function(err, res) {
            if (err) console.error(err);
            console.log("FTP session finalized! See you soon!");
          });
        }
      } else {
        console.log(data);
      }
      running_count--;
    });
  }
}

if (fs.existsSync(db_file)) {
  console.log('preparing task queue...');
  fs.readFile(db_file, 'utf8', function(err,data){
    task_queue = data.split(os.EOL);
    console.log('Retrieved '+task_queue.length+' tasks!');
    for (var i = 0 ; i < max_parallel_count ; i++) {
      getSingleFile(task_queue.pop());
      if (task_queue.length<=0) break;
    }
  });
} else {
  console.log('Couldn\'t found database file: '+db_file);
  console.log('please run parser.js or modify db_file to correct one.');
}
//console.log('All executed!');
