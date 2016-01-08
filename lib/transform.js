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
