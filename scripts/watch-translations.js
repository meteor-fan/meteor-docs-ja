var watch = require('watch');
var exec  = require('child_process').exec;

watch.watchTree('./translations', function(f, current, prev) {
    if (typeof f == "object" && prev === null && current === null) {
      // Finished walking the tree
      console.log('Finished walking the tree');
      return;
    } else if (prev === null) {
      // f is a new file
      console.log(f + ' is new file');
    } else if (current.nlink === 0) {
      // f was removed
      console.log(f + ' was removed');
    } else {
      // f was changed
      console.log(f + ' was changed');
    }

    translate();    
});

function translate() {
  exec('node scripts/translate-docs.js', function(error, stdout, stderr) { 
    if(stdout){
        console.log('stdout: ' + stdout);
    }
    if(stderr){
        console.log('stderr: ' + stderr);
    }
    if (error !== null) {
      console.log('Exec error: ' + error);
    }
  });  
}