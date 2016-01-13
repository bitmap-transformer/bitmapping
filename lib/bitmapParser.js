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

/* Module Exports */
exports.bitmapParser = bitmapParser;
