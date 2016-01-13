#!/usr/bin/env node

var path = require('path');
var Bitmap = require(__dirname + '/../lib/bitmap.js').Bitmap;
var nodeRoot = path.dirname(process.argv[1]).substr(0, path.dirname(process.argv[1]).lastIndexOf('/'));
if (process.argv.length >= 3 && process.argv.length < 5) {
  var bitmap = new Bitmap((process.env.PWD + '/' + process.argv[2]), process.argv[3]);
} else {
  var bitmap = new Bitmap(nodeRoot + '/lib/node_modules/basic-bitmap-transformer/img/demo.bmp');
}
