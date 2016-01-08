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
}

exports.bitmapParser = bitmapParser;
