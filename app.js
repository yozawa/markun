var fs = require('fs');
var markdown = require('markdown').markdown;
var chokidar = require('chokidar');

var watcher = chokidar.watch("./README.md");
watcher.on('add' , updateHTML);
watcher.on('change' , updateHTML);

var container = document.getElementById('container');

function updateHTML(path , stats){
  fs.readFile(path , 'utf-8' , function(err , content){
    if( container != null ){
      alert(container);
    }
    else{
      alert('container is null!!');
    }
    container.innerHTML = markdown.toHTML(content);
  });
}
