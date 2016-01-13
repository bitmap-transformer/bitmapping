/* Global Variables */
var fs = require('fs');
var Buffer = require('buffer').Buffer;
var bitmapParser = require(__dirname + '/bitmapParser.js').bitmapParser;

/* Constructor Function */
var Bitmap = function(bitmapData) {
  var that = this;
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
    if (process.argv.length >= 3 && process.argv.length < 5) {
      if (process.argv[3] === 'greyscalePalette') {
        console.log('Performing greyscale operation on the bitmap\'s color palette.');
        that.transformPaletteToGreyscale(bitmap);
      } else if (process.argv[3] === 'redShiftPalette') {
        console.log('Performing red shift operation on the bitmap\'s color palette.');
        that.transformPaletteToRedChannel(bitmap);
      } else if (process.argv[3] === 'greenShiftPalette') {
        console.log('Performing green shift operation on the bitmap\'s color palette.');
        that.transformPaletteToGreenChannel(bitmap);
      } else if (process.argv[3] === 'blueShiftPalette') {
        console.log('Performing blue shift operation on the bitmap\'s color palette.');
        that.transformPaletteToBlueChannel(bitmap);
      } else if (process.argv[3] === 'greyscalePixels') {
        console.log('Performing greyscale operation on the bitmap\'s pixels.');
        that.transformPixelsToGreyscale(bitmap);
      } else if (process.argv[3] === 'redShiftPixels') {
        console.log('Performing red shift operation on the bitmap\'s pixels.');
        that.transformPixelsToRedChannel(bitmap);
      } else if (process.argv[3] === 'greenShiftPixels') {
        console.log('Performing green shift operation on the bitmap\'s pixels.');
        that.transformPixelsToGreenChannel(bitmap);
      } else if (process.argv[3] === 'blueShiftPixels') {
        console.log('Performing blue shift operation on the bitmap\'s pixels.');
        that.transformPixelsToBlueChannel(bitmap);
      } else {
        console.log(process.argv[3] + ' is not a valid transformation command.');
      }
    }
    if (process.argv.length === 3) {
      console.log('No image processing transformations have been called on the file.');
    }
    console.log();
    console.log('Command Output');
    console.log('Writing transformed bitmap buffer to new bitmap file in the "output" directory.');
    that.writeBitmap(bitmap.transformedBuffer);
  });
};

/* Bitmap Transformations */
//Color Palette Transformations
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
          //Find the greyscale color based on the current RGB values.
          var greyscaleColor = Math.floor((r + g + b + a) / 3);
          //Assign the new buffer values for this pixel.  Starting with the blue component value.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = greyscaleColor.toString(16);
          //Assign the new buffer value for the green component of this pixel.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = greyscaleColor.toString(16);
          //Assign the new buffer value for the red component of this pixel.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = greyscaleColor.toString(16);
          //Assign the new buffer value for the alpha component of this pixel.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 3)] = greyscaleColor.toString(16);
        }
      }
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
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          //Assign the blue component of this pixel to 0.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = parseInt(0).toString(16);
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = parseInt(0).toString(16);
        }
      }
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
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 1)] = parseInt(0).toString(16);
          //Assign the red component of this pixel to 0.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = parseInt(0).toString(16);
        }
      }
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
      if (bitmap.hasOwnProperty('colorPalettePixels')) {
        for(i = 0; i < (bitmap.pixelOffsetInBytes - (14 + bitmap.dibHeaderSize)); i += 4) {
          //Assign the blue component of this pixel to 0.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i)] = parseInt(0).toString(16);
          //Assign the red component of this pixel to 0.
          bitmap.transformedBuffer[((14 + bitmap.dibHeaderSize) + i + 2)] = parseInt(0).toString(16);
        }
      }
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
        var counter = 0;
        for(i = 0; i < pixels; i += 3) {
          //Get the pixel's rgba values.
          var rgba = bitmap.pixels[i / 3];
          //Assign the greyscale color for this pixel.
          var greyscaleColor = Math.floor((rgba[0] + rgba[1] + rgba[2]) / 3);
          //Assign the blue component of this pixel to the greyscale color value.
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = parseInt(greyscaleColor);
          //Assign the green component of this pixel to the greyscale color value.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 1)] = parseInt(greyscaleColor);
          //Assign the red component of this pixel to the greyscale color value.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = parseInt(greyscaleColor);
        }
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
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = parseInt(0);
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 1)] = parseInt(0);
        }
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
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i] = parseInt(0);
          //Assign the red component of this pixel to 0.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = parseInt(0);
        }
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
          //Assign the green component of this pixel to 0.
          bitmap.transformedBuffer[bitmap.pixelOffsetInBytes + i + 1] = parseInt(0);
          //Assign the red component of this pixel to 0.
          bitmap.transformedBuffer[(bitmap.pixelOffsetInBytes + i + 2)] = parseInt(0);
        }
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
  fs.writeFile((__dirname + '/../output/bitmap.bmp'), buffer, function(err) {
    if (err) return console.log(err);
    console.log('The transformed bitmap buffer has successfully been written to the new "bitmap.bmp" file.');
    console.log();
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

/*
  Title: Bitmap Parser
  Author: James Mason
  Description: This is a bitmap file parser which returns an object that can be used to manipulate the bitmap buffer the parser is provided.  It currently only handles BM bitmaps with the DIB type BITMAPINFOHEADER or BITMAPV4HEADER, 8 or 24 bit color depth, and with or without a color palette.
*/

/* Required Libraries */
var os = require('os');

/* Global Variables */
var endianness = os.endianness();

/* Bitmap Parsing function.  Returns an object with the given .bmp file's information. */
function bitmapParser(bitmapBuffer) {
  if (Buffer.isBuffer(bitmapBuffer)) {
    var output = {};
    //Assign the bitmap buffer.
    output.buffer = bitmapBuffer;
    //Assign the operating system's endianness for use throughout the object.
    output.osEndianness = os.endianness();
    //Assign the type of the bitmap (BM, etc...).
    output.typeBuffer = output.buffer.slice(0, 2);
    output.type = output.typeBuffer.toString('utf8');
    if (output.type === 'BM') {
      //Assign the size of the bitmap in bytes.
      output.sizeOfBitmapInBytesBuffer = output.buffer.slice(2, 6);
      output.sizeOfBitmapInBytes = readUInt32OfBufferAt0(output.sizeOfBitmapInBytesBuffer);
      //Assign the pixel offset of the buffer in bytes.
      output.pixelOffsetInBytesBuffer = output.buffer.slice(10, 14);
      output.pixelOffsetInBytes = readUInt32OfBufferAt0(output.pixelOffsetInBytesBuffer);
      //Assign the bitmap's DIB header size and associated type.
      output.dibHeaderSize = getDIBHeaderSize(output.buffer);
      output.dibHeaderType = getDIBHeaderType(output.dibHeaderSize);
      //Assign the bitmap's DIB header information if it has a BITMAPINFOHEADER type DIB.
      if (output.dibHeaderType === 'BITMAPINFOHEADER') {
        //Assign the bitmap's width in pixels.
        output.widthBuffer = output.buffer.slice(18, 22);
        output.width = readUInt32OfBufferAt0(output.widthBuffer);
        //Assign the bitmap's height in pixels.
        output.heightBuffer = output.buffer.slice(22, 26);
        output.height = readUInt32OfBufferAt0(output.heightBuffer);
        //Assign the number of color planes in the bitmap.
        output.numberOfColorPlanesBuffer = output.buffer.slice(26, 28);
        output.numberOfColorPlanes = readUInt16OfBufferAt0(output.numberOfColorPlanesBuffer);
        //Assign the color depth of each bitmap's pixel (the number of bits per pixel).
        output.colorDepthBuffer = output.buffer.slice(28, 30);
        output.colorDepth = readUInt16OfBufferAt0(output.colorDepthBuffer);
        //Assign the value which corresponds to the type of compression the bitmap uses.
        output.compressionMethodIndexBuffer = output.buffer.slice(30, 34);
        output.compressionMethodIndex = readUInt32OfBufferAt0(output.compressionMethodIndexBuffer);
        //Assign the type of compression that the bitmap uses.
        output.compressionType = getCompressionType(output.compressionMethodIndex);
        //Assign the size of the raw bitmap data.
        output.rawDataSizeBuffer = output.buffer.slice(34, 38);
        output.rawDataSize = readUInt32OfBufferAt0(output.rawDataSizeBuffer);
        //Assign the horizontal resolution of the image (pixel/meter signed integer).
        output.horizontalResolutionBuffer = output.buffer.slice(38, 42);
        output.horizontalResolution = readUInt32OfBufferAt0(output.horizontalResolutionBuffer);
        //Assign the vertical resolution of the image (pixel/meter signed integer).
        output.verticalResolutionBuffer = output.buffer.slice(42, 46);
        output.verticalResolution = readUInt32OfBufferAt0(output.verticalResolutionBuffer);
        //Assign the number of colors in the color palette.
        output.numberOfColorsInPaletteBuffer = output.buffer.slice(46, 50);
        output.numberOfColorsInPalette = readUInt32OfBufferAt0(output.numberOfColorsInPaletteBuffer);
        //Assign the number of important colors used.  If this value is equal to 0 then all the colors used are considered important.
        output.numberOfImportantColorsBuffer = output.buffer.slice(50, 54);
        output.numberOfImportantColors = readUInt32OfBufferAt0(output.numberOfImportantColorsBuffer);
        var bitMaskBufferOffset = 0;
        if (output.compressionType === 'BI_BITFIELDS') {
          //Assign the bit masks if necessary.
          output.redBitMaskBuffer = output.buffer.slice(54, 58);
          output.greenBitMaskBuffer = output.buffer.slice(58, 62);
          output.blueBitMaskBuffer = output.buffer.slice(62, 66);
          bitMaskBufferOffset = 12;
        }
        //Assign the color palette.
        output.colorPaletteBuffer = output.buffer.slice((14 + output.dibHeaderSize + bitMaskBufferOffset), output.pixelOffsetInBytes);
        output.colorPalettePixels = [];
        output.colorPalettePixelBuffers = [];
        //Assign the pixels of the color palette and their buffers into 2D arrays for accessibility later.  The following for loop iterates over each pixel of the color palette in the bitmap buffer.
        for(i = 0; i < (output.pixelOffsetInBytes - (14 + output.dibHeaderSize + bitMaskBufferOffset)); i += 4) {
          //Get the buffer of the red component of the pixel, i.
          var bBuffer = output.colorPaletteBuffer.slice(i, (i + 1));
          //Get the buffer of the green component of the pixel, i.
          var gBuffer = output.colorPaletteBuffer.slice((i + 1), (i + 2));
          //Get the buffer of the blue component of the pixel, i.
          var rBuffer = output.colorPaletteBuffer.slice((i + 2), (i + 3));
          //Get the buffer of the alpha component of the pixel, i.
          var aBuffer = output.colorPaletteBuffer.slice((i + 3), (i + 4));
          //Get the integer value of the red component of the pixel, i.
          var r = rBuffer.readUInt8(0);
          //Get the integer value of the green component of the pixel, i.
          var g = gBuffer.readUInt8(0);
          //Get the integer value of the blue component of the pixel, i.
          var b = bBuffer.readUInt8(0);
          //Get the integer value of the alpha component of the pixel, i.
          var a = aBuffer.readUInt8(0);
          //Assign the buffer and integer data into arrays.
          var rgbaBuffer = [rBuffer,gBuffer,bBuffer,aBuffer];
          var rgba = [r,g,b,a];
          //Push the pixel, i, to the color palette pixels property.
          output.colorPalettePixels.push(rgba);
          //Push the pixel buffers of pixel i to the color palette pixel buffers array.
          output.colorPalettePixelBuffers.push(rgbaBuffer);
        }
        output.pixels = [];
        output.pixelBuffers = [];
        var pixelCounter = 0;
        var pixelDepthModifier = 1;
        if (output.colorPalettePixels.length === 0) {
          if (output.colorDepth === 24) {
            pixelDepthModifier = 3;
          } else if (output.colorDepth === 32) {
            pixelDepthModifier = 4;
          }
        }
        //Assign the bitmap's pixels and their corresponding buffers into 2D arrays for accessibility later.
        for(i = output.pixelOffsetInBytes; i < (((output.width * output.height) * pixelDepthModifier) + output.pixelOffsetInBytes); i++) {
          var r, g, b, a;
          if (output.colorPalettePixels.length > 0 && output.colorDepth === 8) {
            //Get the buffer of the pixel, i.
            var pixelBuffer = output.buffer.slice(i, (i + 1));
            //Get the pixel's color palette index value.  This is the index value inside the color palette pixels array which corresponds to this pixel's color.
            var pixelBufferColorPaletteIndex = pixelBuffer.readUInt8(0);
            //Get the integer value of the red component of the pixel, i.
            r = output.colorPalettePixels[pixelBufferColorPaletteIndex][0];
            //Get the integer value of the green component of the pixel, i.
            g = output.colorPalettePixels[pixelBufferColorPaletteIndex][1];
            //Get the integer value of the blue component of the pixel, i.
            b = output.colorPalettePixels[pixelBufferColorPaletteIndex][2];
            //Get the integer value of the alpha component of the pixel, i.
            a = output.colorPalettePixels[pixelBufferColorPaletteIndex][3];
          } else {
            if (output.colorDepth === 24) {
              if (pixelCounter <= ((output.width * output.height) * pixelDepthModifier)) {
                //Get the buffer of the pixel, i.
                var pixelBuffer = output.buffer.slice(i, (i + 3));
                //Get the integer value of the red component of the pixel, i.
                r = pixelBuffer.readUInt8(2);
                //Get the integer value of the green component of the pixel, i.
                g = pixelBuffer.readUInt8(1);
                //Get the integer value of the blue component of the pixel, i.
                b = pixelBuffer.readUInt8(0);
                //Get the integer value of the alpha component of the pixel, i.
                a = 0;
                //Correct for larger buffer slice.  Since the slice is from i to (i + 3) and the loop iterates i++ each time 3 must be added to correct the starting offset of the next pixel since 3 - 1 = 2.
                i += 2;
                pixelCounter++;
              }
            }
          }
          if (pixelCounter <= (output.width * output.height)) {
            //Assign the rgba integer data into an array.
            var rgba = [r,g,b,a];
            //Push the pixel, i, to the pixels array property.
            output.pixels.push(rgba);
            //Push the buffer of pixel i to the pixel buffers array.
            output.pixelBuffers.push(pixelBuffer);
          }
        }
      } else if (output.dibHeaderType === 'BITMAPV4HEADER') {
        //Assign the bitmap's width in pixels.
        output.widthBuffer = output.buffer.slice(18, 22);
        output.width = readUInt32OfBufferAt0(output.widthBuffer);
        //Assign the bitmap's height in pixels.
        output.heightBuffer = output.buffer.slice(22, 26);
        output.height = readUInt32OfBufferAt0(output.heightBuffer);
        //Assign the number of color planes in the bitmap.
        output.numberOfColorPlanesBuffer = output.buffer.slice(26, 28);
        output.numberOfColorPlanes = readUInt16OfBufferAt0(output.numberOfColorPlanesBuffer);
        //Assign the color depth of each bitmap's pixel (the number of bits per pixel).
        output.colorDepthBuffer = output.buffer.slice(28, 30);
        output.colorDepth = readUInt16OfBufferAt0(output.colorDepthBuffer);
        //Assign the value which corresponds to the type of compression the bitmap uses.
        output.compressionMethodIndexBuffer = output.buffer.slice(30, 34);
        output.compressionMethodIndex = readUInt32OfBufferAt0(output.compressionMethodIndexBuffer);
        //Assign the type of compression that the bitmap uses.
        output.compressionType = getCompressionType(output.compressionMethodIndex);
        //Assign the size of the raw bitmap data.
        output.rawDataSizeBuffer = output.buffer.slice(34, 38);
        output.rawDataSize = readUInt32OfBufferAt0(output.rawDataSizeBuffer);
        //Assign the horizontal resolution of the image (pixel/meter signed integer).
        output.horizontalResolutionBuffer = output.buffer.slice(38, 42);
        output.horizontalResolution = readUInt32OfBufferAt0(output.horizontalResolutionBuffer);
        //Assign the vertical resolution of the image (pixel/meter signed integer).
        output.verticalResolutionBuffer = output.buffer.slice(42, 46);
        output.verticalResolution = readUInt32OfBufferAt0(output.verticalResolutionBuffer);
        //Assign the number of colors in the color palette.
        output.numberOfColorsInPaletteBuffer = output.buffer.slice(46, 50);
        output.numberOfColorsInPalette = readUInt32OfBufferAt0(output.numberOfColorsInPaletteBuffer);
        //Assign the number of important colors used.  If this value is equal to 0 then all the colors used are considered important.
        output.numberOfImportantColorsBuffer = output.buffer.slice(50, 54);
        output.numberOfImportantColors = readUInt32OfBufferAt0(output.numberOfImportantColorsBuffer);
        //Assign the red mask.
        output.redMaskBuffer = output.buffer.slice(54, 58);
        output.redMask = readUInt32OfBufferAt0(output.redMaskBuffer);
        //Assign the green mask.
        output.greenMaskBuffer = output.buffer.slice(58, 62);
        output.greenMask = readUInt32OfBufferAt0(output.greenMaskBuffer);
        //Assign the blue mask.
        output.blueMaskBuffer = output.buffer.slice(62, 66);
        output.blueMask = readUInt32OfBufferAt0(output.blueMaskBuffer);
        //Assign the alpha mask.
        output.alphaMaskBuffer = output.buffer.slice(66, 70);
        output.alphaMask = readUInt32OfBufferAt0(output.alphaMaskBuffer);
        //Assign the color space type.
        output.colorSpaceTypeBuffer = output.buffer.slice(70, 74);
        output.colorSpaceType = readUInt32OfBufferAt0(output.colorSpaceTypeBuffer);
        //Assign the CIEXYZ triplet values.  This is a 2D array which follows the pattern [red, green, blue] where red, green, and blue are arrays containing [x, y, z] values.
        output.cieXYZBuffer = output.buffer.slice(74, 110);
        var cieXYZRedBuffer = output.cieXYZBuffer.slice(0, 12);
        var cieXRedBuffer = cieXYZRedBuffer.slice(0, 4);
        var cieYRedBuffer = cieXYZRedBuffer.slice(4, 8);
        var cieZRedBuffer = cieXYZRedBuffer.slice(8, 12);
        var cieXYZRed = [readUInt32OfBufferAt0(cieXRedBuffer),readUInt32OfBufferAt0(cieYRedBuffer),readUInt32OfBufferAt0(cieZRedBuffer)];
        var cieXYZGreenBuffer = output.cieXYZBuffer.slice(12, 24);
        var cieXGreenBuffer = cieXYZGreenBuffer.slice(0, 4);
        var cieYGreenBuffer = cieXYZGreenBuffer.slice(4, 8);
        var cieZGreenBuffer = cieXYZGreenBuffer.slice(8, 12);
        var cieXYZGreen = [readUInt32OfBufferAt0(cieXGreenBuffer),readUInt32OfBufferAt0(cieYGreenBuffer),readUInt32OfBufferAt0(cieZGreenBuffer)];
        var cieXYZBlueBuffer = output.cieXYZBuffer.slice(24, 36);
        var cieXBlueBuffer = cieXYZBlueBuffer.slice(0, 4);
        var cieYBlueBuffer = cieXYZBlueBuffer.slice(4, 8);
        var cieZBlueBuffer = cieXYZBlueBuffer.slice(8, 12);
        var cieXYZBlue = [readUInt32OfBufferAt0(cieXBlueBuffer),readUInt32OfBufferAt0(cieYBlueBuffer),readUInt32OfBufferAt0(cieZBlueBuffer)];
        output.cieXYZ = [cieXYZRed, cieXYZGreen, cieXYZBlue];
        //Assign red gamma value.
        output.redGammaBuffer = output.buffer.slice(110, 114);
        output.redGamma = readUInt32OfBufferAt0(output.redGammaBuffer);
        //Assign green gamma value.
        output.greenGammaBuffer = output.buffer.slice(114, 118);
        output.greenGamma = readUInt32OfBufferAt0(output.greenGammaBuffer);
        //Assign blue gamma value.
        output.blueGammaBuffer = output.buffer.slice(118, 122);
        output.blueGamma = readUInt32OfBufferAt0(output.blueGammaBuffer);
        //Assign the color palette.
        output.colorPaletteBuffer = output.buffer.slice((14 + output.dibHeaderSize), output.pixelOffsetInBytes);
        output.colorPalettePixels = [];
        output.colorPalettePixelBuffers = [];
        //Assign the pixels of the color palette and their buffers into 2D arrays for accessibility later.  The following for loop iterates over each pixel of the color palette in the bitmap buffer.
        for(i = 0; i < (output.pixelOffsetInBytes - (14 + output.dibHeaderSize)); i += 4) {
          //Get the buffer of the red component of the pixel, i.
          var bBuffer = output.colorPaletteBuffer.slice(i, (i + 1));
          //Get the buffer of the green component of the pixel, i.
          var gBuffer = output.colorPaletteBuffer.slice((i + 1), (i + 2));
          //Get the buffer of the blue component of the pixel, i.
          var rBuffer = output.colorPaletteBuffer.slice((i + 2), (i + 3));
          //Get the buffer of the alpha component of the pixel, i.
          var aBuffer = output.colorPaletteBuffer.slice((i + 3), (i + 4));
          //Get the integer value of the red component of the pixel, i.
          var r = rBuffer.readUInt8(0);
          //Get the integer value of the green component of the pixel, i.
          var g = gBuffer.readUInt8(0);
          //Get the integer value of the blue component of the pixel, i.
          var b = bBuffer.readUInt8(0);
          //Get the integer value of the alpha component of the pixel, i.
          var a = aBuffer.readUInt8(0);
          //Assign the buffer and integer data into arrays.
          var rgbaBuffer = [rBuffer,gBuffer,bBuffer,aBuffer];
          var rgba = [r,g,b,a];
          //Push the pixel, i, to the color palette pixels property.
          output.colorPalettePixels.push(rgba);
          //Push the pixel buffers of pixel i to the color palette pixel buffers array.
          output.colorPalettePixelBuffers.push(rgbaBuffer);
        }
        output.pixels = [];
        output.pixelBuffers = [];
        var pixelCounter = 0;
        var pixelDepthModifier = 1;
        if (output.colorPalettePixels.length === 0) {
          if (output.colorDepth === 24) {
            pixelDepthModifier = 3;
          } else if (output.colorDepth === 32) {
            pixelDepthModifier = 4;
          }
        }
        //Assign the bitmap's pixels and their corresponding buffers into 2D arrays for accessibility later.
        for(i = output.pixelOffsetInBytes; i < (((output.width * output.height) * pixelDepthModifier) + output.pixelOffsetInBytes); i++) {
          var r, g, b, a;
          if (output.colorPalettePixels.length > 0 && output.colorDepth === 8) {
            //Get the buffer of the pixel, i.
            var pixelBuffer = output.buffer.slice(i, (i + 1));
            //Get the pixel's color palette index value.  This is the index value inside the color palette pixels array which corresponds to this pixel's color.
            var pixelBufferColorPaletteIndex = pixelBuffer.readUInt8(0);
            //Get the integer value of the red component of the pixel, i.
            r = output.colorPalettePixels[pixelBufferColorPaletteIndex][0];
            //Get the integer value of the green component of the pixel, i.
            g = output.colorPalettePixels[pixelBufferColorPaletteIndex][1];
            //Get the integer value of the blue component of the pixel, i.
            b = output.colorPalettePixels[pixelBufferColorPaletteIndex][2];
            //Get the integer value of the alpha component of the pixel, i.
            a = output.colorPalettePixels[pixelBufferColorPaletteIndex][3];
          } else {
            if (output.colorDepth === 24) {
              if (pixelCounter <= ((output.width * output.height) * pixelDepthModifier)) {
                //Get the buffer of the pixel, i.
                var pixelBuffer = output.buffer.slice(i, (i + 3));
                //Get the integer value of the red component of the pixel, i.
                r = pixelBuffer.readUInt8(2);
                //Get the integer value of the green component of the pixel, i.
                g = pixelBuffer.readUInt8(1);
                //Get the integer value of the blue component of the pixel, i.
                b = pixelBuffer.readUInt8(0);
                //Get the integer value of the alpha component of the pixel, i.
                a = 0;
                //Correct for larger buffer slice.  Since the slice is from i to (i + 3) and the loop iterates i++ each time 3 must be added to correct the starting offset of the next pixel since 3 - 1 = 2.
                i += 2;
                pixelCounter++;
              }
            }
          }
          if (pixelCounter <= (output.width * output.height)) {
            //Assign the rgba integer data into an array.
            var rgba = [r,g,b,a];
            //Push the pixel, i, to the pixels array property.
            output.pixels.push(rgba);
            //Push the buffer of pixel i to the pixel buffers array.
            output.pixelBuffers.push(pixelBuffer);
          }
        }
      }
    } else {
      return 'Error: bitmapParser only parses BM type bitmaps.';
    }
    //Uncomment this function to console log the data parsed and added into the output variable.
    //consoleLogParsedData(output);
    return output;
  } else if (bitmapBuffer === undefined) {
    return 'Error: bitmapParser has not been provided a [bitmapBuffer].  [bitmapBuffer] must be a buffer provided to the function.';
  } else {
    return 'Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.';
  }
};

/* Helper Functions */
function readUInt32OfBufferAt0(buffer) {
  var output = -1;
  if (endianness === 'LE') {
    output = buffer.readUInt32LE(0);
  } else {
    output = buffer.readUInt32BE(0);
  }
  return output;
}
function readUInt16OfBufferAt0(buffer) {
  var output = -1;
  if (endianness === 'LE') {
    output = buffer.readUInt16LE(0);
  } else {
    output = buffer.readUInt16BE(0);
  }
  return output;
}
function getDIBHeaderSize(bitmapBuffer) {
  var output = -1;
  if (endianness === 'LE') {
    output = bitmapBuffer.readUInt32LE(14);
  } else {
    output = bitmapBuffer.readUInt32BE(14);
  }
  return output;
}
function getDIBHeaderType(size) {
  var output = 'Error: Bitmap DIB header is not a standard format.';
  if (size === 12) {
    output = 'BITMAPCOREHEADEROS21XBITMAPHEADER';
  } else if (size === 40) {
    output = 'BITMAPINFOHEADER';
  } else if (size === 52) {
    output = 'BITMAPV2INFOHEADER';
  } else if (size === 56) {
    output = 'BITMAPV3INFOHEADER';
  } else if (size === 64) {
    output = 'OS22XBITMAPHEADER';
  } else if (size === 108) {
    output = 'BITMAPV4HEADER';
  } else if (size === 124) {
    output = 'BITMAPV5HEADER';
  }
  return output;
}
function getCompressionType(compressionMethodIndex) {
  var output = 'Error: The compression method index provided does not correspond to a standard compression type.';
  if (compressionMethodIndex === 0) {
    output = 'BI_RGB';
  } else if (compressionMethodIndex === 1) {
    output = 'BI_RLE8';
  } else if (compressionMethodIndex === 2) {
    output = 'BI_RLE4';
  } else if (compressionMethodIndex === 3) {
    output = 'BI_BITFIELDS';
  } else if (compressionMethodIndex === 4) {
    output = 'BI_JPEG';
  } else if (compressionMethodIndex === 5) {
    output = 'BI_PNG';
  } else if (compressionMethodIndex === 6) {
    output = 'BI_ALPHABITFIELDS';
  } else if (compressionMethodIndex === 11) {
    output = 'BI_CMYK';
  } else if (compressionMethodIndex === 12) {
    output = 'BI_CMYKRLE8';
  } else if (compressionMethodIndex === 13) {
    output = 'BI_CMYKRLE4';
  }
  return output;
}
function consoleLogParsedData(output) {
  if (output.hasOwnProperty('osEndianness')) console.log('Operating system endianness: ' + output.osEndianness);
  if (output.hasOwnProperty('type')) console.log('Bitmap type: ' + output.type);
  if (output.hasOwnProperty('sizeOfBitmapInBytes')) console.log('Size of the bitmap in bytes: ' + output.sizeOfBitmapInBytes);
  if (output.hasOwnProperty('pixelOffsetInBytes')) console.log('Pixel offset in bytes: ' + output.pixelOffsetInBytes);
  if (output.hasOwnProperty('dibHeaderSize')) console.log('DIB header size: ' + output.dibHeaderSize);
  if (output.hasOwnProperty('dibHeaderType')) console.log('DIB header type: ' + output.dibHeaderType);
  if (output.hasOwnProperty('width')) console.log('Width: ' + output.width);
  if (output.hasOwnProperty('height')) console.log('Height: ' + output.height);
  if (output.hasOwnProperty('numberOfColorPlanes')) console.log('Number of color planes:' + output.numberOfColorPlanes);
  if (output.hasOwnProperty('colorDepth')) console.log('Color depth: ' + output.colorDepth);
  if (output.hasOwnProperty('compressionMethodIndex')) console.log('Compression method index: ' + output.compressionMethodIndex);
  if (output.hasOwnProperty('compressionType')) console.log('Compression type: ' + output.compressionType);
  if (output.hasOwnProperty('rawDataSize')) console.log('Raw data size: ' + output.rawDataSize);
  if (output.hasOwnProperty('horizontalResolution')) console.log('Horizontal resolution: ' + output.horizontalResolution);
  if (output.hasOwnProperty('verticalResolution')) console.log('Vertical resolution: ' + output.verticalResolution);
  if (output.hasOwnProperty('numberOfColorsInPalette')) console.log('Number of colors in palette: ' + output.numberOfColorsInPalette);
  if (output.hasOwnProperty('numberOfImportantColors')) console.log('Number of important colors: ' + output.numberOfImportantColors);
  if (output.hasOwnProperty('colorPalettePixels')) console.log('Color palette pixels array length: ' + output.colorPalettePixels.length);
  if (output.hasOwnProperty('pixels')) console.log('Pixels array length: ' + output.pixels.length);
  if (output.hasOwnProperty('redMask')) console.log('Red mask: ' + output.redMask);
  if (output.hasOwnProperty('greenMask')) console.log('Green mask: ' + output.greenMask);
  if (output.hasOwnProperty('blueMask')) console.log('Blue mask: ' + output.blueMask);
  if (output.hasOwnProperty('alphaMask')) console.log('Alpha mask: ' + output.alphaMask);
  if (output.hasOwnProperty('colorSpaceType')) console.log('Color space type: ' + output.colorSpaceType);
  if (output.hasOwnProperty('cieXYZ')) console.log('CIEXYZ triplet: ' + output.cieXYZ);
  if (output.hasOwnProperty('redGamma')) console.log('Red gamma: ' + output.redGamma);
  if (output.hasOwnProperty('greenGamma')) console.log('Green gamma: ' + output.greenGamma);
  if (output.hasOwnProperty('blueGamma')) console.log('Blue gamma: ' + output.blueGamma);
}

/* Module Exports */
exports.bitmapParser = bitmapParser;
