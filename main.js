'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var dialog = require('dialog');
var Menu = require('menu');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

require('crash-reporter').start();

var mainWindow = null;

var outputPath = "./presen.html";
var path ="./README.md";

app.on('window-all-closed' , function(){
  if(process.platform != 'darwin'){
    app.quit();
  }
});

app.on('ready' , function(){
  mainWindow = new BrowserWindow(
    { width: 800, height: 600}
  );

 Menu.setApplicationMenu(menu);

  //初期読み込み
  readFile(path);

  mainWindow.loadUrl(
    "file://"+ __dirname + '/index.html'
  );

  mainWindow.on('closed' , function(){
      mainWindow = null;
  });

});


// メニュー情報の作成
var template = [
  {
    label: 'Markun',
    submenu: [
      {label: '終了', accelerator: 'Command+Q', click: function() {app.quit();}}
    ]
  }, {
    label: 'File',
    submenu: [
      {label: '開く', accelerator: 'Command+O', click: function(){
          dialog.showOpenDialog(BrowserWindow.getFocusedWindow(),
          {
            filters: [
                {name: 'MarkdownText', extensions: ['txt', 'md']},
            ],
            properties: ['openFile']} , function (filenames){
              if(filenames !== null && filenames.length > 0){
                readFile(filenames[0]);
              }
           });
      }}
    ]
  }, {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'Command+R', click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); } },
      { label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); } }
    ]
  }
];

var menu = Menu.buildFromTemplate(template);


/**
 * テンプレートを読み込みながらpathのファイルを流し込んで出力する。
 */
function readFile(path) {
    var templatePath = "./reveral.html";
    fs.readFile(templatePath, "utf-8" , function (error, tempText) {
        if (error != null) {
            alert('error : ' + error);
            return ;
        }
        readMarkdown(path , function(text){
          tempText = tempText.replace(/MarkdownTemplate/ , text);
          console.log(tempText);
          fs.writeFile(outputPath , tempText , function(error){
            console.log(error);
          });

          //メインウインドウに表示する。
          mainWindow.loadUrl("file://"+ __dirname + '/presen.html');

        });

    });

}

//マークダウンファイルを読み込んで読み込み終わったらコールバックを呼ぶ
function readMarkdown(path , fun){

  var rs = fs.createReadStream(path);
  var rl = readline.createInterface(rs , {});

  var regexp = /(^# |^## )/;

  var contentsText  = null;

  rl.on('line' , function(line){

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
     fun(contentsText);
  });

}