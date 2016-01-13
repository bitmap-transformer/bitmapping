var Bitmap = require(__dirname + '/../lib/bitmap.js').Bitmap;
var bitmapParser = require(__dirname + '/../lib/bitmapParser.js').bitmapParser;
var expect = require('chai').expect;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var os = require('os');
var bitmapOneForTests = (__dirname + '/img/bitmap_1_for_testing.bmp');

describe('Bitmap Object', function() {
  describe('Bitmap(bitmap, transform)', function() {
    var bitmap = null;
    var bitmapData = null;
    before(function(done) {
      fs.readFile(bitmapOneForTests, function(err, data) {
        if(err) throw err;
        bitmapData = data;
        bitmap = new Bitmap('');
        done();
      });
    });
    it('Should return an object.', function() {
      expect(typeof bitmap).to.equal('object');
    });
    describe('transformPaletteToGreyscale(bitmap)', function() {
      it('Should be able to set a bitmap\'s color palette to greyscale values.', function() {
        var colorPaletteBuffer = new Buffer(18);
        colorPaletteBuffer[14] = 200;
        colorPaletteBuffer[15] = 130;
        colorPaletteBuffer[16] = 240;
        var transformedBuffer = new Buffer(18);
        var demoBitmap = {
          'numberOfColorsInPalette' : 1,
          'pixelOffsetInBytes' : 18,
          'dibHeaderSize' : 0,
          'buffer' : colorPaletteBuffer,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var greyscaledBuffer = anyBitmap.transformPaletteToGreyscale(demoBitmap);
        expect(greyscaledBuffer.readUInt8(14)).to.equal(190);
        expect(greyscaledBuffer.readUInt8(15)).to.equal(190);
        expect(greyscaledBuffer.readUInt8(16)).to.equal(190);
      });
    });
    describe('transformPaletteToRedChannel(bitmap)', function() {
      it('Should be able to set the RGB values of a bitmap\'s color palette to only have red values >= 0.', function() {
        var colorPaletteBuffer = new Buffer(18);
        colorPaletteBuffer[14] = 200;
        colorPaletteBuffer[15] = 130;
        colorPaletteBuffer[16] = 240;
        var transformedBuffer = new Buffer(18);
        var demoBitmap = {
          'numberOfColorsInPalette' : 1,
          'pixelOffsetInBytes' : 18,
          'dibHeaderSize' : 0,
          'buffer' : colorPaletteBuffer,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var redBuffer = anyBitmap.transformPaletteToRedChannel(demoBitmap);
        expect(redBuffer.readUInt8(14)).to.equal(0);
        expect(redBuffer.readUInt8(15)).to.equal(0);
        expect(redBuffer.readUInt8(16)).to.equal(240);
      });
    });
    describe('transformPaletteToGreenChannel(bitmap)', function() {
      it('Should be able to set the RGB values of a bitmap\'s color palette to only have green values >= 0.', function() {
        var colorPaletteBuffer = new Buffer(18);
        colorPaletteBuffer[14] = 200;
        colorPaletteBuffer[15] = 130;
        colorPaletteBuffer[16] = 240;
        var transformedBuffer = new Buffer(18);
        var demoBitmap = {
          'numberOfColorsInPalette' : 1,
          'pixelOffsetInBytes' : 18,
          'dibHeaderSize' : 0,
          'buffer' : colorPaletteBuffer,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var greenBuffer = anyBitmap.transformPaletteToGreenChannel(demoBitmap);
        expect(greenBuffer.readUInt8(14)).to.equal(0);
        expect(greenBuffer.readUInt8(15)).to.equal(130);
        expect(greenBuffer.readUInt8(16)).to.equal(0);
      });
    });
    describe('transformPaletteToBlueChannel(bitmap)', function() {
      it('Should be able to set the RGB values of a bitmap\'s color palette to only have blue values >= 0.', function() {
        var colorPaletteBuffer = new Buffer(18);
        colorPaletteBuffer[14] = 200;
        colorPaletteBuffer[15] = 130;
        colorPaletteBuffer[16] = 240;
        var transformedBuffer = new Buffer(18);
        var demoBitmap = {
          'numberOfColorsInPalette' : 1,
          'pixelOffsetInBytes' : 18,
          'dibHeaderSize' : 0,
          'buffer' : colorPaletteBuffer,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var blueBuffer = anyBitmap.transformPaletteToBlueChannel(demoBitmap);
        expect(blueBuffer.readUInt8(14)).to.equal(200);
        expect(blueBuffer.readUInt8(15)).to.equal(0);
        expect(blueBuffer.readUInt8(16)).to.equal(0);
      });
    });
    describe('transformPixelsToGreyscale(bitmap)', function() {
      it('Should be able to set a bitmap\'s pixels to greyscale values.', function() {
        var transformedBuffer = new Buffer(3);
        var pixels = [[10, 20, 30, 0]];
        var demoBitmap = {
          'pixels' : pixels,
          'colorDepth' : 24,
          'width' : 1,
          'height' : 1,
          'pixelOffsetInBytes' : 0,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var greyscaledBuffer = anyBitmap.transformPixelsToGreyscale(demoBitmap);
        expect(greyscaledBuffer.readUInt8(2)).to.equal(20);
        expect(greyscaledBuffer.readUInt8(1)).to.equal(20);
        expect(greyscaledBuffer.readUInt8(0)).to.equal(20);
      });
    });
    describe('transformPixelsToRedChannel(bitmap)', function() {
      it('Should be able to set a bitmap\'s pixels to red values >= 0.', function() {
        var transformedBuffer = new Buffer(3);
        var pixels = [[10, 20, 30, 0]];
        var demoBitmap = {
          'pixels' : pixels,
          'colorDepth' : 24,
          'width' : 1,
          'height' : 1,
          'pixelOffsetInBytes' : 0,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var redBuffer = anyBitmap.transformPixelsToRedChannel(demoBitmap);
        expect(redBuffer.readUInt8(2)).to.equal(10);
        expect(redBuffer.readUInt8(1)).to.equal(0);
        expect(redBuffer.readUInt8(0)).to.equal(0);
      });
    });
    describe('transformPixelsToGreenChannel(bitmap)', function() {
      it('Should be able to set a bitmap\'s pixels to red values >= 0.', function() {
        var transformedBuffer = new Buffer(3);
        var pixels = [[10, 20, 30, 0]];
        var demoBitmap = {
          'pixels' : pixels,
          'colorDepth' : 24,
          'width' : 1,
          'height' : 1,
          'pixelOffsetInBytes' : 0,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var greenBuffer = anyBitmap.transformPixelsToGreenChannel(demoBitmap);
        expect(greenBuffer.readUInt8(2)).to.equal(0);
        expect(greenBuffer.readUInt8(1)).to.equal(20);
        expect(greenBuffer.readUInt8(0)).to.equal(0);
      });
    });
    describe('transformPixelsToBlueChannel(bitmap)', function() {
      it('Should be able to set a bitmap\'s pixels to blue values >= 0.', function() {
        var transformedBuffer = new Buffer(3);
        var pixels = [[10, 20, 30, 0]];
        var demoBitmap = {
          'pixels' : pixels,
          'colorDepth' : 24,
          'width' : 1,
          'height' : 1,
          'pixelOffsetInBytes' : 0,
          'transformedBuffer' : transformedBuffer
        };
        var anyBitmap = new Bitmap('');
        var blueBuffer = anyBitmap.transformPixelsToBlueChannel(demoBitmap);
        expect(blueBuffer.readUInt8(2)).to.equal(0);
        expect(blueBuffer.readUInt8(1)).to.equal(0);
        expect(blueBuffer.readUInt8(0)).to.equal(30);
      });
    });
  });
});
