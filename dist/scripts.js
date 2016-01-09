var bitmapParser = function(bitmapBuffer) {
  debugger;
  var output = {};
  var type = bitmapBuffer.slice(0,2);
  output.type = type;
  console.log(type.toString('utf8'));
  var sizeOfBitmapInBytes = bitmapBuffer.slice(2,6);
  console.log(sizeOfBitmapInBytes.readUInt32LE(0));
  output.sizeOfBitmapInBytes = sizeOfBitmapInBytes;
  var pixelOffsetInBytes = bitmapBuffer.slice(10,14);
  console.log(pixelOffsetInBytes.readUInt32LE(0));
  output.pixelOffsetInBytes = pixelOffsetInBytes;

  return output;
};

exports.bitmapParser = bitmapParser;

var fs = require('fs');
var transform = require(__dirname + '/transform').transform;

function readBitmap(file) {
  fs.readFile(file, function(err, data) {
    if(err) {
      return console.log(err);
    }
    getHeadInfo(data);
    transform(data);
  });
}

function getHeadInfo(data) {
  var headInfo = {};
  headInfo.type = data.toString('utf8', 0, 2);
  headInfo.size = data.readUInt32LE(2);
  headInfo.pixels = data.readUInt32LE(10);
  headInfo.palette = data.readUInt32LE(46);
  headInfo.someColors = data.toString('utf8', 54, 94);
  console.log(headInfo);
  return headInfo;
}

exports.readBitmap = readBitmap;
exports.getHeadInfo = getHeadInfo;

var readBitmap = require(__dirname + '/bitmap_data_reader.js');
var newBitmap = require(__dirname + '/write_new_bitmap.js').makeNew;

function transform(data) {
  var xformData = [];

  for (var i = 0; i < data.length; i++) {
    data[i] = data.readUInt8(i);
    xformData.push(data[i]);
  }

  for (var j = 54; j < xformData.length; j++) {
    if (xformData[j] % 2) {
      xformData[j] = Math.floor(Math.random() * 255);
    }
    xformData[j] = xformData[j] / 2;
  }
  newBitmap(xformData);
}

exports.transform = transform;

var fs = require('fs');
var transform = require(__dirname + '/transform.js').transform;

function makeNew(xformdata) {
  var newBitmap = new Buffer(xformdata);
  fs.writeFile('new_bitmap.bmp', newBitmap, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Success, your file has been created!');
  });
}

exports.makeNew = makeNew;
