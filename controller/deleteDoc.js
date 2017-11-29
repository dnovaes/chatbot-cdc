var client = require("connection.js");

//using this file, you can delete a specific document from the corpus of indexed documents in
//the elastic search. For example, the document 'title2' of index 'cdc' will be deleted when
//this file executes

client.delete({  
  index: 'cdc',
  title: 'title2'
},function(err,resp,status) {
    console.log(resp);
});
