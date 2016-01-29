var fs = require('fs');
var readline = require('readline');

function readMarkdown(path){

  var rs = fs.createReadStream(path);
  var rl = readline.createInterface(rs , {});

  var regexp = /(^### |^## )/;

  var contentsText  = null;

  return rl.on('line' , function(line){

    if(line !== null){
      if(line.match(regexp)){

        if(contentsText !== null){
          contentsText += "</script></section>\r\n";
          contentsText += "<section data-markdown><script type=\"text/template\">\r\n";
        }
        else{
          contentsText = "";
        }
      }

      contentsText += line + "\r\n";

    }
  }).on('close' ,function(){
    return contentsText;
  });

}
