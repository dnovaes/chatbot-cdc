const client            = require('./connection.js');

/*
var query= process.argv[2]!= undefined ? process.argv[2]: 0; 
if (!query){
  console.log("Please provide a valid path as argument");
  process.exit();
}
*/

var es = {
  search: function(content){
    var result = [];

    let params = {
      index: 'cdc',
      q: content
    }

    client.search(params).then(function(res){
      console.log(res);
      return res;
    });
    /*
    client.search(params, function(error, response){
      if(error){
        console.log("search error: "+error);
      }
      else{
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");

        //if using it as function do:
        //return response; 
        //else
        response.hits.hits.forEach(function(hit){
            //console.log(hit);
            result.push(hit);
        })
        return result;
      }
    }
    */
  }
} 

module.exports = es;
