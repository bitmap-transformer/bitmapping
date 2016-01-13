/* Global Variables */
var fs = require('fs');
var Buffer = require('buffer').Buffer;
var path = require('path');
var mkdirp = require('mkdirp');
var bitmapParser = require(__dirname + '/bitmapParser.js').bitmapParser;

/* Constructor Function */
var Bitmap = function(bitmapData, transform) {
  var that = this;
  if (bitmapData !== '') {
    fs.readFile(bitmapData, function(err, data) {
      if(err) return console.log(err);
      console.log();
      var bitmap = bitmapParser(data);
      bitmap.fileName = bitmapData.substr((bitmapData.lastIndexOf('/') + 1), bitmapData.length);
      bitmap.transformedBuffer = new Buffer(bitmap.buffer);
      console.log('File Information');
      that.consoleLogBitmapObject(bitmap);
      console.log();
      console.log('File Transformation');
      if (transform !== undefined) {
        if (transform === 'greyscalePalette') {
          console.log('Performing greyscale operation on the bitmap\'s color palette.');
          that.transformPaletteToGreyscale(bitmap);
        } else if (transform === 'redShiftPalette') {
          console.log('Performing red shift operation on the bitmap\'s color palette.');
          that.transformPaletteToRedChannel(bitmap);
        } else if (transform === 'greenShiftPalette') {
          console.log('Performing green shift operation on the bitmap\'s color palette.');
          that.transformPaletteToGreenChannel(bitmap);
        } else if (transform === 'blueShiftPalette') {
          console.log('Performing blue shift operation on the bitmap\'s color palette.');
          that.transformPaletteToBlueChannel(bitmap);
        } else if (transform === 'greyscalePixels') {
          console.log('Performing greyscale operation on the bitmap\'s pixels.');
          that.transformPixelsToGreyscale(bitmap);
        } else if (transform === 'redShiftPixels') {
          console.log('Performing red shift operation on the bitmap\'s pixels.');
          that.transformPixelsToRedChannel(bitmap);
        } else if (transform === 'greenShiftPixels') {
          console.log('Performing green shift operation on the bitmap\'s pixels.');
          that.transformPixelsToGreenChannel(bitmap);
        } else if (transform === 'blueShiftPixels') {
          console.log('Performing blue shift operation on the bitmap\'s pixels.');
          that.transformPixelsToBlueChannel(bitmap);
        } else {
          console.log(transform + ' is not a valid transformation command.');
        }
      } else {
        console.log('No image processing transformations have been called on the file.');
      }
      console.log();
      console.log('Command Output');
      console.log('Writing transformed bitmap buffer to a new bitmap file.');
      that.writeBitmap(bitmap.transformedBuffer);
      that.bitmap = bitmap;
    });
  }
};

/* Bitmap Transformations */
//Color Palette Transformations
Bitmap.prototype.transformPaletteToGreyscale = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
        bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
        //Get the buffer of the blue component of the pixel, i.
        var bBuffer = bitmap.colorPaletteBuffer.slice(i, (i + 1));
        //Get the buffer of the green component of the pixel, i.
        var gBuffer = bitmap.colorPaletteBuffer.slice((i + 1), (i + 2));
        //Get the buffer of the red component of the pixel, i.
        var rBuffer = bitmap.colorPaletteBuffer.slice((i + 2), (i + 3));
        //Get the integer value of the red component of the pixel, i.
        var r = rBuffer.readUInt8(0);
        //Get the integer value of the green component of the pixel, i.
        var g = gBuffer.readUInt8(0);
        //Get the integer value of the blue component of the pixel, i.
        var b = bBuffer.readUInt8(0);
        //Find the greyscale color based on the current RGB values.
        var greyscaleColor = Math.floor((r + g + b) / 3);
        //Assign the new buffer values for this pixel.  Starting with the blue component value.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = greyscaleColor;
        //Assign the new buffer value for the green component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = greyscaleColor;
        //Assign the new buffer value for the red component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = greyscaleColor;
      }
      return bitmap.transformedBuffer;
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
Bitmap.prototype.transformPaletteToRedChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
        bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
        //Get the buffer of the blue component of the pixel, i.
        var bBuffer = bitmap.colorPaletteBuffer.slice(i, (i + 1));
        //Get the buffer of the green component of the pixel, i.
        var gBuffer = bitmap.colorPaletteBuffer.slice((i + 1), (i + 2));
        //Get the buffer of the red component of the pixel, i.
        var rBuffer = bitmap.colorPaletteBuffer.slice((i + 2), (i + 3));
        //Get the integer value of the red component of the pixel, i.
        var r = rBuffer.readUInt8(0);
        //Get the integer value of the green component of the pixel, i.
        var g = gBuffer.readUInt8(0);
        //Get the integer value of the blue component of the pixel, i.
        var b = bBuffer.readUInt8(0);
        //Assign the new buffer values for this pixel.  Starting with the blue component value.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = 0;
        //Assign the new buffer value for the green component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = 0;
        //Assign the new buffer value for the red component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = r;
      }
      return bitmap.transformedBuffer;
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
Bitmap.prototype.transformPaletteToBlueChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
        bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
        //Get the buffer of the blue component of the pixel, i.
        var bBuffer = bitmap.colorPaletteBuffer.slice(i, (i + 1));
        //Get the buffer of the green component of the pixel, i.
        var gBuffer = bitmap.colorPaletteBuffer.slice((i + 1), (i + 2));
        //Get the buffer of the red component of the pixel, i.
        var rBuffer = bitmap.colorPaletteBuffer.slice((i + 2), (i + 3));
        //Get the integer value of the red component of the pixel, i.
        var r = rBuffer.readUInt8(0);
        //Get the integer value of the green component of the pixel, i.
        var g = gBuffer.readUInt8(0);
        //Get the integer value of the blue component of the pixel, i.
        var b = bBuffer.readUInt8(0);
        //Assign the new buffer values for this pixel.  Starting with the blue component value.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = b;
        //Assign the new buffer value for the green component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = 0;
        //Assign the new buffer value for the red component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = 0;
      }
      return bitmap.transformedBuffer;
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
Bitmap.prototype.transformPaletteToGreenChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) {
    if (bitmap.numberOfColorsInPalette > 0) {
      for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
        bitmap.colorPaletteBuffer = bitmap.buffer.slice((14 + bitmap.dibHeaderSize), bitmap.pixelOffsetInBytes);
        //Get the buffer of the blue component of the pixel, i.
        var bBuffer = bitmap.colorPaletteBuffer.slice(i, (i + 1));
        //Get the buffer of the green component of the pixel, i.
        var gBuffer = bitmap.colorPaletteBuffer.slice((i + 1), (i + 2));
        //Get the buffer of the red component of the pixel, i.
        var rBuffer = bitmap.colorPaletteBuffer.slice((i + 2), (i + 3));
        //Get the integer value of the red component of the pixel, i.
        var r = rBuffer.readUInt8(0);
        //Get the integer value of the green component of the pixel, i.
        var g = gBuffer.readUInt8(0);
        //Get the integer value of the blue component of the pixel, i.
        var b = bBuffer.readUInt8(0);
        //Assign the new buffer values for this pixel.  Starting with the blue component value.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = 0;
        //Assign the new buffer value for the green component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = g;
        //Assign the new buffer value for the red component of this pixel.
        bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = 0;
      }
      return bitmap.transformedBuffer;
    } else {
      console.log('This bitmap does not have a palette to transform.');
    }
  } else {
    console.log('This bitmap does not have a defined number of palette colors.  You cannot transform the color palette until it has been fully initialized within the Bitmap object.');
  }
};
//Pixel Transformations
Bitmap.prototype.transformPixelsToGreyscale = function(bitmap) {
  if (bitmap.hasOwnProperty('pixels')) {
    if (bitmap.colorDepth === 24) {
      if (bitmap.pixels.length !== 0) {
        var pixels = (bitmap.width * bitmap.height * 3);
        for(i = 0; i < pixels; i += 3) {
          //Get the pixel's rgba values.
          var rgba = bitmap.pixels[i / 3];
          //Assign the greyscale color for this pixel.
          var greyscaleColor = Math.floor((rgba[0] + rgba[1] + rgba[2]) / 3);
          //Assign the blue component of this pixel to the greyscale color value.
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = greyscaleColor;
          //Assign the green component of this pixel to the greyscale color value.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 1)] = greyscaleColor;
          //Assign the red component of this pixel to the greyscale color value.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = greyscaleColor;
        }
        return bitmap.transformedBuffer;
      } else {
        console.log('Error: The bitmap must have pixels to continue transformation.');
      }
    } else {
      console.log('Error: The bitmap must have 24 bit color depth to continue transformation.');
    }
  } else {
    console.log('Error: The bitmap has no pixels array, cannot continue transformation.');
  }
};
Bitmap.prototype.transformPixelsToRedChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('pixels')) {
    if (bitmap.colorDepth === 24) {
      if (bitmap.pixels.length !== 0) {
        for(i = 0; i < (bitmap.width * bitmap.height * 3); i += 3) {
          //Assign the blue component of this pixel to 0.
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = 0;
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 1)] = 0;
          //Assign the red component of this pixel to itself.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = bitmap.pixels[i / 3][0];
        }
        return bitmap.transformedBuffer;
      } else {
        console.log('Error: The bitmap must have pixels to continue transformation.');
      }
    } else {
      console.log('Error: The bitmap must have 24 bit color depth to continue transformation.');
    }
  } else {
    console.log('Error: The bitmap has no pixels array, cannot continue transformation.');
  }
};
Bitmap.prototype.transformPixelsToGreenChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('pixels')) {
    if (bitmap.colorDepth === 24) {
      if (bitmap.pixels.length !== 0) {
        for(i = 0; i < (bitmap.width * bitmap.height * 3); i += 3) {
          //Assign the blue component of this pixel to 0.
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = 0;
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 1)] = bitmap.pixels[i / 3][1];
          //Assign the red component of this pixel to itself.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = 0;
        }
        return bitmap.transformedBuffer;
      } else {
        console.log('Error: The bitmap must have pixels to continue transformation.');
      }
    } else {
      console.log('Error: The bitmap must have 24 bit color depth to continue transformation.');
    }
  } else {
    console.log('Error: The bitmap has no pixels array, cannot continue transformation.');
  }
};
Bitmap.prototype.transformPixelsToBlueChannel = function(bitmap) {
  if (bitmap.hasOwnProperty('pixels')) {
    if (bitmap.colorDepth === 24) {
      if (bitmap.pixels.length !== 0) {
        for(i = 0; i < (bitmap.width * bitmap.height * 3); i += 3) {
          //Assign the blue component of this pixel to 0.
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = bitmap.pixels[i / 3][2];
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 1)] = 0;
          //Assign the red component of this pixel to itself.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = 0;
        }
        return bitmap.transformedBuffer;
      } else {
        console.log('Error: The bitmap must have pixels to continue transformation.');
      }
    } else {
      console.log('Error: The bitmap must have 24 bit color depth to continue transformation.');
    }
  } else {
    console.log('Error: The bitmap has no pixels array, cannot continue transformation.');
  }
};

/* Bitmap Helper Functions */
Bitmap.prototype.writeBitmap = function(buffer) {
  //Write the created bitmap, "bitmap.bmp" into the "output" directory located in the project root directory.
  var outputPath = path.join(process.env.PWD, '/basic-bitmap-transformer-output/');
  mkdirp(outputPath, function(err) {
    if (err) return (err);
    fs.writeFile((outputPath + 'bitmap.bmp'), buffer, function(err) {
      if (err) return console.log(err);
      console.log('The transformed bitmap buffer has successfully been written to the new "bitmap.bmp" file.  It is located in the ' + outputPath + ' directory.');
      console.log();
    });
  });
};
Bitmap.prototype.consoleLogBitmapObject = function(bitmap) {
  if (bitmap.hasOwnProperty('fileName')) console.log('File: ' + bitmap.fileName);
  if (bitmap.hasOwnProperty('osEndianness')) console.log('Operating system endianness: ' + bitmap.osEndianness);
  if (bitmap.hasOwnProperty('type')) console.log('Bitmap type: ' + bitmap.type);
  if (bitmap.hasOwnProperty('sizeOfBitmapInBytes')) console.log('Size of the bitmap in bytes: ' + bitmap.sizeOfBitmapInBytes);
  if (bitmap.hasOwnProperty('pixelOffsetInBytes')) console.log('Pixel offset in bytes: ' + bitmap.pixelOffsetInBytes);
  if (bitmap.hasOwnProperty('dibHeaderSize')) console.log('DIB header size: ' + bitmap.dibHeaderSize);
  if (bitmap.hasOwnProperty('dibHeaderType')) console.log('DIB header type: ' + bitmap.dibHeaderType);
  if (bitmap.hasOwnProperty('width')) console.log('Width: ' + bitmap.width);
  if (bitmap.hasOwnProperty('height')) console.log('Height: ' + bitmap.height);
  if (bitmap.hasOwnProperty('numberOfColorPlanes')) console.log('Number of color planes:' + bitmap.numberOfColorPlanes);
  if (bitmap.hasOwnProperty('colorDepth')) console.log('Color depth: ' + bitmap.colorDepth);
  if (bitmap.hasOwnProperty('compressionMethodIndex')) console.log('Compression method index: ' + bitmap.compressionMethodIndex);
  if (bitmap.hasOwnProperty('compressionType')) console.log('Compression type: ' + bitmap.compressionType);
  if (bitmap.hasOwnProperty('rawDataSize')) console.log('Raw data size: ' + bitmap.rawDataSize);
  if (bitmap.hasOwnProperty('horizontalResolution')) console.log('Horizontal resolution: ' + bitmap.horizontalResolution);
  if (bitmap.hasOwnProperty('verticalResolution')) console.log('Vertical resolution: ' + bitmap.verticalResolution);
  if (bitmap.hasOwnProperty('numberOfColorsInPalette')) console.log('Number of colors in palette: ' + bitmap.numberOfColorsInPalette);
  if (bitmap.hasOwnProperty('numberOfImportantColors')) console.log('Number of important colors: ' + bitmap.numberOfImportantColors);
  if (bitmap.hasOwnProperty('colorPalettePixels')) console.log('Color palette pixels array length: ' + bitmap.colorPalettePixels.length);
  if (bitmap.hasOwnProperty('pixels')) console.log('Pixels array length: ' + bitmap.pixels.length);
  if (bitmap.hasOwnProperty('redMask')) console.log('Red mask: ' + bitmap.redMask);
  if (bitmap.hasOwnProperty('greenMask')) console.log('Green mask: ' + bitmap.greenMask);
  if (bitmap.hasOwnProperty('blueMask')) console.log('Blue mask: ' + bitmap.blueMask);
  if (bitmap.hasOwnProperty('alphaMask')) console.log('Alpha mask: ' + bitmap.alphaMask);
  if (bitmap.hasOwnProperty('colorSpaceType')) console.log('Color space type: ' + bitmap.colorSpaceType);
  if (bitmap.hasOwnProperty('cieXYZ')) console.log('CIEXYZ triplet: ' + bitmap.cieXYZ);
  if (bitmap.hasOwnProperty('redGamma')) console.log('Red gamma: ' + bitmap.redGamma);
  if (bitmap.hasOwnProperty('greenGamma')) console.log('Green gamma: ' + bitmap.greenGamma);
  if (bitmap.hasOwnProperty('blueGamma')) console.log('Blue gamma: ' + bitmap.blueGamma);
};

/* Module Exports */
exports.Bitmap = Bitmap;
