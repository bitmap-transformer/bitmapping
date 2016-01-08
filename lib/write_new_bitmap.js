var fs = require('fs');
var transform = require(__dirname + '/transform.js').transform;

function makeNew(xformdata) {
  var newBitmap = new Buffer(xformdata);
  fs.writeFile('new_bitmap.bmp', newBitmap, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Success, you\'re file has been created!');
  });
}

exports.makeNew = makeNew;
