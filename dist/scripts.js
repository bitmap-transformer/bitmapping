var os = require('os');

var bitmapParser = function(bitmapBuffer) {
  debugger;
  if (Buffer.isBuffer(bitmapBuffer)) {
    var output = {};
    output.osEndianness = os.endianness();
    output.type = bitmapBuffer.slice(0,2);
    output.sizeOfBitmapInBytes = bitmapBuffer.slice(2,6);
    output.pixelOffsetInBytes = bitmapBuffer.slice(10,14);
    return output;
  } else if (bitmapBuffer === undefined) {
    return 'Error: bitmapParser has not been provided a [bitmapBuffer].  [bitmapBuffer] must be a buffer provided to the function.';
  } else {
    return 'Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.';
  }
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
