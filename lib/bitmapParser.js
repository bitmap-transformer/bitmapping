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
