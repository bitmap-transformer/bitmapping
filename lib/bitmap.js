var fs = require('fs');
var Buffer = require('buffer').Buffer;
var bitmapParser = require(__dirname + '/bitmapParser.js').bitmapParser;

var Bitmap = function(bitmapData) {
  var that = this;
  fs.readFile(bitmapData, function(err, data) {
    if(err) return console.log(err);
    var bitmap = bitmapParser(data);
    //that.transformPaletteToGreyscale(bitmap);
    //that.transformPaletteToRedChannel(bitmap);
    //that.transformPaletteToGreenChannel(bitmap);
    //that.transformPaletteToBlueChannel(bitmap);
    that.writeBitmap(bitmap.buffer);
  });
};
Bitmap.prototype.writeBitmap = function(buffer) {
  fs.writeFile('new_bitmap.bmp', buffer, function(err) {
    if (err) return console.log(err);
    console.log('Success, your file has been created!');
  });
};
//Note: This transformation is destructive.
Bitmap.prototype.transformPaletteToGreyscale = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
          //Get the buffer of the blue component of the pixel, i.
          var bBuffer = bitmap.colorPaletteBuffer.slice(i, (i + 1));
          //Get the buffer of the green component of the pixel, i.
          var gBuffer = bitmap.colorPaletteBuffer.slice((i + 1), (i + 2));
          //Get the buffer of the red component of the pixel, i.
          var rBuffer = bitmap.colorPaletteBuffer.slice((i + 2), (i + 3));
          //Get the buffer of the alpha component of the pixel, i.
          var aBuffer = bitmap.colorPaletteBuffer.slice((i + 3), (i + 4));
          //Get the integer value of the red component of the pixel, i.
          var r = rBuffer.readUInt8(0);
          //Get the integer value of the green component of the pixel, i.
          var g = gBuffer.readUInt8(0);
          //Get the integer value of the blue component of the pixel, i.
          var b = bBuffer.readUInt8(0);
          //Get the integer value of the alpha component of the pixel, i.
          var a = aBuffer.readUInt8(0);
          var greyscaleColor = Math.floor((r + g + b + a) / 3);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i)] = greyscaleColor.toString(16);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 1)] = greyscaleColor.toString(16);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 2)] = greyscaleColor.toString(16);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 3)] = greyscaleColor.toString(16);
        }
      }
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
//Note: This transformation is destructive.
Bitmap.prototype.transformPaletteToRedChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i)] = parseInt(0).toString(16);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 1)] = parseInt(0).toString(16);
        }
      }
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
//Note: This transformation is destructive.
Bitmap.prototype.transformPaletteToBlueChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 1)] = parseInt(0).toString(16);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 2)] = parseInt(0).toString(16);
        }
      }
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
//Note: This transformation is destructive.
Bitmap.prototype.transformPaletteToGreenChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i)] = parseInt(0).toString(16);
          bitmap.buffer[((14 + bitmap.dibHeaderSize) + i + 2)] = parseInt(0).toString(16);
        }
      }
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};

//Not yet implemented
function getPixelAt(x, y) {
  if (this.hasOwnProperty('pixels')) {
    if ((this.width - 1) >= x && 0 < x ) {
      if ((this.height - 1) >= y && 0 < y) {
        var rowMultiplier = y;
        var rowLength = this.width;
        var rowIndex = rowLength * rowMultiplier;
        var pixelIndex = rowIndex + x;
        return this.pixels[pixelIndex];
      }
    }
  }
}
function setPixelAt(x, y, rgbaArray) {
  if (this.hasOwnProperty('pixels')) {
    if ((this.width - 1) >= x && 0 < x ) {
      if ((this.height - 1) >= y && 0 < y) {
        if ((rgbaArray[0] >= 0 && rgbaArray[0] <= 255) && (rgbaArray[1] >= 0 && rgbaArray[1] <= 255) && (rgbaArray[2] >= 0 && rgbaArray[2] <= 255) && (rgbaArray[3] >= 0 && rgbaArray[3] <= 255)) {
          var rowMultiplier = y;
          var rowLength = this.width;
          var rowIndex = rowLength * rowMultiplier;
          var pixelIndex = rowIndex + x;
          this.pixels[pixelIndex] = rgbaArray;
          var pixelBuffer = new Buffer[4];
          pixelBuffer[0] = parseInt(rgbaArray[2]).toString(16);
          pixelBuffer[1] = parseInt(rgbaArray[1]).toString(16);
          pixelBuffer[2] = parseInt(rgbaArray[0]).toString(16);
          pixelBuffer[3] = parseInt(rgbaArray[3]).toString(16);
          this.pixelBuffers[pixelIndex] = pixelBuffer;
        }
      }
    }
  }
}

exports.Bitmap = Bitmap;
