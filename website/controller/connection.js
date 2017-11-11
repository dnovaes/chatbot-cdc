var es = require('elasticsearch');

var client = new es.Client({
  hosts:[
//    'http://localhost:9200',
    'https://c4pow5a1rd:52dfrzgn76@first-cluster-713454587.us-east-1.bonsaisearch.net'
  ],
  //log: 'trace',
  index:{
    blocks: {
      read_only: true
    }
  }
});

module.exports = client;
