var bitmapParser = require(__dirname + '/../lib/bitmapParser.js').bitmapParser;
var expect = require('chai').expect;
var fs = require('fs');
var os = require('os');
var bitmapOneForTests = (__dirname + '/../img/bitmap_1_for_testing.bmp');

describe('Bitmap Parser', function() {
  describe('bitmapParser()', function() {
    it('Should return "Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer." when a [bitmapBuffer] argument provided to the function is not a node buffer.', function() {
      expect(bitmapParser(1)).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser(1.0)).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser([])).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser({})).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser(null)).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser(function() {})).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
    });
    it('Should return "Error: bitmapParser has not been provided a [bitmapBuffer].  [bitmapBuffer] must be a buffer provided to the function." when [bitmapBuffer] is not provided to the function.', function() {
      expect(bitmapParser()).to.equal('Error: bitmapParser has not been provided a [bitmapBuffer].  [bitmapBuffer] must be a buffer provided to the function.');
    });
    it('Should return the proper endianness of the operating system being used, the proper type of the bitmap being parsed, the proper size of the bitmap being parsed (in bytes), the bitmap\'s proper pixel offset (in bytes).', function(done) {
      fs.readFile(bitmapOneForTests, function(err, data) {
        if(err) throw err;
        var bitmap = bitmapParser(data);
        expect(bitmap.osEndianness).to.equal('LE');
        var bitmapType = bitmap.type.toString('utf8');
        expect(bitmapType).to.equal('BM');
        var bitmapSizeInBytes = -1;
        var bitmapPixelOffsetInBytes = -1;
        if (bitmap.osEndianness === 'LE') {
          bitmapSizeInBytes = bitmap.sizeOfBitmapInBytes.readUInt32LE(0);
          bitmapPixelOffsetInBytes = bitmap.pixelOffsetInBytes.readUInt32LE(0);
        } else if (bitmap.osEndianness === 'BE') {
          bitmapSizeInBytes = bitmap.sizeOfBitmapInBytes.readUInt32BE(0);
          bitmapPixelOffsetInBytes = bitmap.pixelOffsetInBytes.readUInt32BE(0);
        }
        expect(bitmapSizeInBytes).to.equal(11078);
        expect(bitmapPixelOffsetInBytes).to.equal(1078);
        done();
      });
    });
  });
});
