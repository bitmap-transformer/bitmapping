var path = require('path');
var Bitmap = require(__dirname + '/lib/bitmap.js').Bitmap;
if (process.argv.length >= 3 && process.argv.length < 5) {
  var bitmap = new Bitmap((process.env.PWD + '/' + process.argv[2]), process.argv[3]);
} else {
  var bitmap = new Bitmap(process.env.PWD + '/img/demo.bmp');
}
