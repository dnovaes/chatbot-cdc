var client = require("connection.js");

//using this file u can delete a index/shard in elasticsearch by the name of index by argument.
//ex: node deleteIndex.js nameofindexhere

client.indices.delete({index: process.argv[2]}, function(err, resp, status){
    console.log("delete", resp);
});

