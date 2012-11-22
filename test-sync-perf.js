var fs=require('fs'),
  path=require('path'),
  util=require('util');

/*
var cache_root='cache\\10kq';
var target_files = fs.readdirSync(path.resolve(cache_root));
var count=target_files.length;

console.time('sync read file');
target_files.forEach(function(file_name){
  var data = fs.readFileSync(path.resolve(cache_root,file_name),'utf8');
});
console.timeEnd('sync read file');

console.time('non-sync read file');
target_files.forEach(function(file_name){
  fs.readFile(path.resolve(cache_root,file_name),'utf8',function(err, data){
    if(!--count){
      console.timeEnd('non-sync read file');

      console.time('sync read file');
      target_files.forEach(function(file_name){
        var data = fs.readFileSync(path.resolve(cache_root,file_name),'utf8');
      });
      console.timeEnd('sync read file');
    }
  });
});
*/

var data = fs.readFileSync('cache\\10kq\\0000108985-10-000048.txt','utf8');

var sectioning_regex=/<SEC-HEADER>((?:.|\r|\n)*)<\/SEC-HEADER>/;
var documents_regex=/<DOCUMENT>((?:.|\r|\n)*)<\/DOCUMENT>/;
var fields_to_catch_regex=[
                      /ACCESSION NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /CONFORMED SUBMISSION TYPE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /PUBLIC DOCUMENT COUNT:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /CONFORMED PERIOD OF REPORT:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /FILED AS OF DATE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /DATE AS OF CHANGE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /COMPANY CONFORMED NAME:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /CENTRAL INDEX KEY:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /STANDARD INDUSTRIAL CLASSIFICATION:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /IRS NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /STATE OF INCORPORATION:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /FISCAL YEAR END:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /FORM TYPE:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /SEC ACT:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /SEC FILE NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/,
                      /FILM NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*/
                    ];
var fields_to_catch=[
                      "ACCESSION NUMBER",
                      "CONFORMED SUBMISSION TYPE",
                      "PUBLIC DOCUMENT COUNT",
                      "CONFORMED PERIOD OF REPORT",
                      "FILED AS OF DATE",
                      "DATE AS OF CHANGE",
                      "COMPANY CONFORMED NAME",
                      "CENTRAL INDEX KEY",
                      "STANDARD INDUSTRIAL CLASSIFICATION",
                      "IRS NUMBER",
                      "STATE OF INCORPORATION",
                      "FISCAL YEAR END",
                      "FORM TYPE",
                      "SEC ACT",
                      "SEC FILE NUMBER",
                      "FILM NUMBER",                         
                      ""
                    ];
var header_regex=new RegExp(fields_to_catch.join(':\\s+([^\\r\\n]+)(?:.|\\r|\\n)*'));

var spl = data.split(/(?:<DOCUMENT>|<\/DOCUMENT>)/);
/*
for(var j = 0 ; j < 4 ; j++) {
  j&&console.time('combined,'+j);
  for(var i = 0 ; i < 10000 ; i++) {
    var m = spl[0].match(header_regex);
  }
  j&&console.timeEnd('combined,'+j);
  j&&console.time('seperated,'+j);
  for(var i = 0 ; i < 10000 ; i++) {
    var m = [];
    fields_to_catch_regex.forEach(function(regex,i){
      m.push(spl[0].match(regex));
    });
    //var m = spl[0].match(header_regex);
  }
  j&&console.timeEnd('seperated,'+j);
}

spl.forEach(function(c,i){
  var c = util.inspect(c);
  console.log('sec[%d]'+c.substr(0,40)+'...'+c.substr(-40), i);
  console.log('------------------------------------------------');
});

var m;
m = data.match(documents_regex);
//m = data.match(sectioning_regex);
m.forEach(function(c,i){
  if (i==0) return;
  //console.dir(c);
  var c = util.inspect(c);
  console.log(c.substr(0,100)+'...'+c.substr(-100));
  console.log('------------------------------------------------');
});

var count = 10;
var regex = /ACCESSION NUMBER:\s+([^\r\n]+)(?:.|\r|\n)*CONFORMED SUBMISSION TYPE:\s+([^\r\n]+)(?:.|\r|\n)*PUBLIC DOCUMENT COUNT:\s+([^\r\n]+)/;

console.time('non-compile match');
for(var i = 0 ; i < count; i++) {
  m = data.match(regex);
}
console.timeEnd('non-compile match');
console.dir(m[1]);
console.dir(m[2]);
console.dir(m[3]);

console.time('compile match');
regex.compile('PUBLIC DOCUMENT COUNT:\\s+(\\d+)');
for(var i = 0 ; i < count; i++) {
  m = data.match(regex);
}
console.timeEnd('compile match');
console.dir(m[1]);
console.dir(m[2]);
console.dir(m[3]);
*/
