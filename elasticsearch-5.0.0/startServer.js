const execFile = require('child_process').execFile;

const childES = execFile('./bin/elasticsearch', (error, stdout, stderr) => {
  if (error) {
    console.log(stderr);
    //throw error;
    return;
  }
  console.log(stdout);
});

childES.stderr.on('data', (data) => {
  console.log(data.toString());
});

childES.stdout.on('data', (data) => {
  console.log(data.toString());
});

childES.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});


const childWebsite = execFile('node', ['../../Siri-Law-Br/elastic_node/index.js'], (error, stdout, stderr) => {
  if (error) {
    console.log(stderr);
    //throw error;
    return;
  }
  console.log(stdout);
});

childWebsite.stderr.on('data', (data) => {
  console.log(data.toString());
});

childWebsite.stdout.on('data', (data) => {
  console.log(data.toString());
});

childWebsite.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});
