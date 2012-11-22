var fs = require('fs'),
  path = require('path'),
  Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

var db_host = 'localhost',
  db_port = Connection.DEFAULT_PORT,
  db_name = 'edgar';

var cache_root='cache\\10kq';
var target_root='cache\\10kq-unpacked';
var source_files=fs.readdirSync(path.resolve(cache_root));
var fields_regex={
                   "ACCESSION NUMBER":/ACCESSION NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "CONFORMED SUBMISSION TYPE":/CONFORMED SUBMISSION TYPE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "PUBLIC DOCUMENT COUNT":/PUBLIC DOCUMENT COUNT:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "CONFORMED PERIOD OF REPORT":/CONFORMED PERIOD OF REPORT:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "FILED AS OF DATE":/FILED AS OF DATE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "DATE AS OF CHANGE":/DATE AS OF CHANGE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "COMPANY CONFORMED NAME":/COMPANY CONFORMED NAME:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "CENTRAL INDEX KEY":/CENTRAL INDEX KEY:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "STANDARD INDUSTRIAL CLASSIFICATION":/STANDARD INDUSTRIAL CLASSIFICATION:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "IRS NUMBER":/IRS NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "STATE OF INCORPORATION":/STATE OF INCORPORATION:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "FISCAL YEAR END":/FISCAL YEAR END:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "FORM TYPE":/FORM TYPE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "SEC ACT":/SEC ACT:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "SEC FILE NUMBER":/SEC FILE NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/,
                   "FILM NUMBER":/FILM NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/
                 };
var filename_regex=/<FILENAME>([^\r\n]*)/;
var content_regex=/<TEXT>((?:.|\r|\n)*)<\/TEXT>/;

console.log("Connecting to " + db_host + ":" + db_port);

var doc_10kqs=[];
var count=0;
source_files.forEach(function(file_name){
  // TODO: we should check file count to make sure
  var file_path=path.join(cache_root,file_name);
  if(path.extname(file_name)=='.txt'){
    count++;
    var target_path=path.join(target_root,path.basename(file_name,'.txt'));
    if(!fs.existsSync(target_path)){
      fs.readFile(file_path,'utf8',function(err, data){
        if(err)console.error(err);
        //console.log(file_path+' is read into memory! target: '+target_path);
        var doc_10kq={};
        var sections=data.split(/(?:<DOCUMENT>|<\/DOCUMENT>)/);
        doc_10kq['FILENAMES']=[];
        sections.forEach(function(section,i){
          if(i==0){
            // parse header
            for(field in fields_regex){
              var m=section.match(fields_regex[field]);
              if(m&&m[1]) {
                doc_10kq[field]=m[1];
              }
            }
            if(doc_10kq["ACCESSION NUMBER"]!=path.basename(file_name,'.txt')){
              console.log(doc_10kq["ACCESSION NUMBER"]+'!='+path.basename(file_name,'.txt'));
            }
          } else if(i<sections.length-1 && section!='\n') {//skip last section
            // parse documents
            if(i==1){
              fs.mkdirSync(path.resolve(target_path));
            }
            var filename=section.match(filename_regex)[1];
            var content=section.match(content_regex)[1];
            doc_10kq['FILENAMES'].push(filename);
            fs.writeFile(path.resolve(target_path,filename),content,'utf8',function(err){
              console.log('%s done!',filename);
            });
            //console.log('sec[%d]{%s}'+content.substr(0,40)+'...'+content.substr(-40), i, filename);
          }
        });
        doc_10kq['TARGET PATH']=target_path;
        doc_10kqs.push(doc_10kq);
        //console.dir(doc_10kq);
        console.log('Parsing '+file_path+' is Done! Target: '+target_path);
        count--;
        if(count<=0){
          var doc_10kqs_db=doc_10kqs;
          doc_10kqs=[];

          console.log("Connecting to " + db_host + ":" + db_port);
          var db = new Db(db_name, new Server(db_host, db_port, {}), {native_parser:true});
          db.open(function(err,db){
            if(err) console.error(err);
            db.collection('10kq', function(err, collection) {
              if(err) console.error(err);
              collection.insert(doc_10kqs_db);
              db.close();
              console.log("Connection of " + db_host + " closed.");
            });
          });

        };
      });
    } else {
      console.log(target_path+' exists! Will skip it.');
    }
  }
});

/*
console.log("Connecting to " + db_host + ":" + db_port);

var db = new Db(db_name, new Server(db_host, db_port, {}), {native_parser:true});
db.open(function(err,db){
  if (err) console.error(err);
  db.collection('10kq_files', function(err, collection) {
    if (err) console.error(err);
    console.log('created:');
    console.dir(collection);

    var objectCount = 100;
    var objects = [];
    var messages=['hola', 'hello', 'aloha', 'ciao'];
    console.log('>> generate test data');
    for(var i=0;i<objectCount;i++) {
      objects.push({'number':i,'rndm':((5*Math.random())+1),'msg':messages[parseInt(4*Math.random())]});
    }
    console.log('generated');

    console.log('>> inserteing data ('+objects.length+')');
    collection.insert(objects);
    console.log('inserted');

    console.log('>> creating index');
    collection.createIndex([['all'],['_id',1],['number',1],['rndm',1],['msg',1]],function(err, indexName){
      console.log('created index: '+indexName);

      console.log('>> gathering index information');

      collection.indexInformation(function(err,doc){
        console.log('indexInformation: ');
        console.dir(doc);

        console.log('>> dropping index');
        collection.dropIndex('all_1__id_1_number_1_rndm_1_msg_1', function(err,result){
          console.log('dropped: ');
          console.dir(result);

          console.log('>> gathering index information');

          collection.indexInformation(function(err,doc){
            console.log('indexInformation: ');
            console.dir(doc);
            console.log('>> closing connection');
            db.close();
          });
        });
      });
    });
  });
});
*/
