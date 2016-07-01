var fs = require('fs');
var exec = require('child_process').exec;

var COPY_FILE_PATTERN = /^guide.*\.html$/;

var copyGeneratedToWork = function() {
  console.log('-- refresh html in work --');
  console.log('copy pattern: ', COPY_FILE_PATTERN);
  fs.readdirSync('work').forEach(function(file) {
    if (!COPY_FILE_PATTERN.test(file)) return;
    fs.createReadStream(file).pipe(fs.createWriteStream('work/' + file));
  });
};

var translate = function() {
  console.log('-- translate --');
  exec('npm run translate', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    if (stderr) {
      console.log('stderr: ' + stderr);
      console.log('error: ' + error);
    } else {
      copyGeneratedToWork();
    }
  });
};

var generate = function() {
  console.log('-- generate --');
  exec('npm run generate', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    if (stderr) {
      console.log('stderr: ' + stderr);
      console.log('error: ' + error);
    } else {
      translate();
    }
  });
};

generate();
