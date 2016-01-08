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
