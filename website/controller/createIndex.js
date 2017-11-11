/*
 * How to use:
 * execute this file and pass the name of the index to be created as parameter.
 * Ex: node createIndex.js indexnamehere
 *
*/

var client = require("./connection.js");
var process = require("process");

client.indices.create({
  index: process.argv.slice(2).toString()
}, function(err, resp, status){
  if(err){
    console.log(err);
  }else{
    console.log("create", resp);
  }
});

