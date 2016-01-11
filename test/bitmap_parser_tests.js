var bitmapParser = require(__dirname + '/../lib/bitmapParser.js').bitmapParser;
var expect = require('chai').expect;
var fs = require('fs');
var os = require('os');
var bitmapOneForTests = (__dirname + '/img/bitmap_1_for_testing.bmp');
var bitmapOneReference = '100px by 100px bitmap with a color palette and 8 bit color depth';
var bitmapTwoForTests = (__dirname + '/img/bitmap_2_for_testing.bmp');
var bitmapTwoReference = '100px by 100px bitmap with no color palette and 24 bit color depth';
var bitmapThreeForTests = (__dirname + '/img/bitmap_3_for_testing.bmp');
var bitmapThreeReference = '150px by 150px bitmap with no color palette and 24 bit color depth';
var bitmapFourForTests = (__dirname + '/img/bitmap_4_for_testing.bmp');
var bitmapFourReference = '50px by 100px bitmap with no color palette and 24 bit color depth';
var bitmapFiveForTests = (__dirname + '/img/bitmap_5_for_testing.bmp');

describe('Bitmap Parser', function() {
  describe('bitmapParser(bitmapFile)', function() {
    it('Should return an informative error message when an argument with an invalid type has been provided.', function() {
      expect(bitmapParser(1)).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser(1.0)).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser([])).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser({})).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser(null)).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
      expect(bitmapParser(function() {})).to.equal('Error: bitmapParser has been provided an invalid [bitmapBuffer].  [bitmapBuffer] must be a buffer.');
    });
    it('Should return an informative error message when no argument is has been provided.', function() {
      expect(bitmapParser()).to.equal('Error: bitmapParser has not been provided a [bitmapBuffer].  [bitmapBuffer] must be a buffer provided to the function.');
    });
    describe(('When passed a ' + bitmapOneReference + ' it...'), function() {
      it('Should parse the bitmap file.', function(done) {
        fs.readFile(bitmapOneForTests, function(err, data) {
          if(err) throw err;
          var bitmap = bitmapParser(data);
          describe(('The bitmap parser should return an object with the header information of the ' + bitmapOneReference + ' that...'), function() {
            it('Should have a property containing the endianness of the operating system being used.', function() {
              expect(bitmap.osEndianness).to.equal('LE');
            });
            it('Should have a property containing the type of the bitmap being parsed.', function() {
              expect(bitmap.type).to.equal('BM');
            });
            it('Should have a property containing the size of the bitmap being parsed (in bytes).', function() {
              expect(bitmap.sizeOfBitmapInBytes).to.equal(11078);
            });
            it('Should have a property containing the bitmap\'s pixels offset (in bytes).', function() {
              expect(bitmap.pixelOffsetInBytes).to.equal(1078);
            });
            it('Should have a property containing the bitmap\'s DIB header size.', function() {
              expect(bitmap.dibHeaderSize).to.equal(40);
            });
            it('Should have a property containing the bitmap\'s DIB header type.', function() {
              expect(bitmap.dibHeaderType).to.equal('BITMAPINFOHEADER');
              if (bitmap.dibHeaderType === 'BITMAPINFOHEADER') {
                describe(('If the ' + bitmapOneReference + ' has a "BITMAPINFOHEADER" DIB header, bitmapParser() should return an object which also...'), function() {
                  it('Should have a property containing the bitmap\'s width (in pixels).', function() {
                    expect(bitmap.width).to.equal(100);
                  });
                  it('Should have a property containing the bitmap\'s height (in pixels).', function() {
                    expect(bitmap.height).to.equal(100);
                  });
                  it('Should have a property containing the number of color planes in the bitmap.', function() {
                    expect(bitmap.numberOfColorPlanes).to.equal(1);
                  });
                  it('Should have a property containing the bitmap\'s pixel color depth.', function() {
                    expect(bitmap.colorDepth).to.equal(8);
                  });
                  it('Should have a property containing the bitmap\'s compression method lookup index.', function() {
                    expect(bitmap.compressionMethodIndex).to.equal(0);
                  });
                  it('Should have a property containing the bitmap\'s compression type.', function() {
                    expect(bitmap.compressionType).to.equal('BI_RGB');
                  });
                  it('Should have a property containing the bitmap\'s raw data size.', function() {
                    expect(bitmap.rawDataSize).to.equal(10000);
                  });
                  it('Should have a property containing the bitmap\'s horizontal resolution (in pixels per meter).', function() {
                    expect(bitmap.horizontalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the bitmap\'s vertical resolution (in pixels per meter).', function() {
                    expect(bitmap.verticalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the number of colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfColorsInPalette).to.equal(256);
                  });
                  it('Should have a property containing the number of important colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfImportantColors).to.equal(256);
                  });
                  it('Should have a property containing color palette pixels and another with their buffers.', function() {
                    expect(bitmap.colorPalettePixels.length).to.equal(256);
                    expect(bitmap.colorPalettePixelBuffers.length).to.equal(256);
                    if (bitmap.numberOfColorsInPalette !== 0) {
                      describe(('If the ' + bitmapOneReference + ' has colors in it\'s palette colors array...'), function() {
                        it('It should store valid RGBA pixel color arrays in the bitmap\'s color palette pixels array.', function() {
                          for (i = 0; i < bitmap.colorPalettePixels.length; i++) {
                            expect(bitmap.colorPalettePixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                  it('Should have a property containing pixels and another with their buffers.', function() {
                    expect(bitmap.pixels.length).to.equal(bitmap.width * bitmap.height);
                    expect(bitmap.pixelBuffers.length).to.equal(bitmap.width * bitmap.height);
                    if (bitmap.pixels.length !== 0) {
                      describe(('If the ' + bitmapOneReference + ' has pixels in it\'s image...'), function() {
                        it('It should store valid RGBA pixel color arrays in each element of the bitmap\'s pixel array.', function() {
                          for (i = 0; i < bitmap.pixels.length; i++) {
                            expect(bitmap.pixels[i].length).to.equal(4);
                            expect(bitmap.pixels[i][0]).to.equal(bitmap.colorPalettePixels[bitmap.pixelBuffers[i].readUInt8(0)][0]);
                            expect(bitmap.pixels[i][1]).to.equal(bitmap.colorPalettePixels[bitmap.pixelBuffers[i].readUInt8(0)][1]);
                            expect(bitmap.pixels[i][2]).to.equal(bitmap.colorPalettePixels[bitmap.pixelBuffers[i].readUInt8(0)][2]);
                            expect(bitmap.pixels[i][3]).to.equal(bitmap.colorPalettePixels[bitmap.pixelBuffers[i].readUInt8(0)][3]);
                            expect(bitmap.pixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                });
              }
            });
          });
          done();
        });
      });
    });
    describe(('When passed a ' + bitmapTwoReference + ' it...'), function() {
      it('Should parse the bitmap file.', function(done) {
        fs.readFile(bitmapTwoForTests, function(err, data) {
          if(err) throw err;
          var bitmap = bitmapParser(data);
          describe(('The bitmap parser should return an object with the header information of the ' + bitmapTwoReference + ' that...'), function() {
            it('Should have a property containing the endianness of the operating system being used.', function() {
              expect(bitmap.osEndianness).to.equal('LE');
            });
            it('Should have a property containing the type of the bitmap being parsed.', function() {
              expect(bitmap.type).to.equal('BM');
            });
            it('Should have a property containing the size of the bitmap being parsed (in bytes).', function() {
              expect(bitmap.sizeOfBitmapInBytes).to.equal(30056);
            });
            it('Should have a property containing the bitmap\'s pixels offset (in bytes).', function() {
              expect(bitmap.pixelOffsetInBytes).to.equal(54);
            });
            it('Should have a property containing the bitmap\'s DIB header size.', function() {
              expect(bitmap.dibHeaderSize).to.equal(40);
            });
            it('Should have a property containing the bitmap\'s DIB header type.', function() {
              expect(bitmap.dibHeaderType).to.equal('BITMAPINFOHEADER');
              if (bitmap.dibHeaderType === 'BITMAPINFOHEADER') {
                describe(('If the ' + bitmapTwoReference + ' has a "BITMAPINFOHEADER" DIB header, bitmapParser() should return an object which also...'), function() {
                  it('Should have a property containing the bitmap\'s width (in pixels).', function() {
                    expect(bitmap.width).to.equal(100);
                  });
                  it('Should have a property containing the bitmap\'s height (in pixels).', function() {
                    expect(bitmap.height).to.equal(100);
                  });
                  it('Should have a property containing the number of color planes in the bitmap.', function() {
                    expect(bitmap.numberOfColorPlanes).to.equal(1);
                  });
                  it('Should have a property containing the bitmap\'s pixel color depth.', function() {
                    expect(bitmap.colorDepth).to.equal(24);
                  });
                  it('Should have a property containing the bitmap\'s compression method lookup index.', function() {
                    expect(bitmap.compressionMethodIndex).to.equal(0);
                  });
                  it('Should have a property containing the bitmap\'s compression type.', function() {
                    expect(bitmap.compressionType).to.equal('BI_RGB');
                  });
                  it('Should have a property containing the bitmap\'s raw data size.', function() {
                    expect(bitmap.rawDataSize).to.equal(30002);
                  });
                  it('Should have a property containing the bitmap\'s horizontal resolution (in pixels per meter).', function() {
                    expect(bitmap.horizontalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the bitmap\'s vertical resolution (in pixels per meter).', function() {
                    expect(bitmap.verticalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the number of colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfColorsInPalette).to.equal(0);
                  });
                  it('Should have a property containing the number of important colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfImportantColors).to.equal(0);
                  });
                  it('Should have a property containing color palette pixels and another with their buffers.', function() {
                    expect(bitmap.colorPalettePixels.length).to.equal(0);
                    expect(bitmap.colorPalettePixelBuffers.length).to.equal(0);
                    if (bitmap.numberOfColorsInPalette !== 0) {
                      describe(('If the ' + bitmapTwoReference + ' has colors in it\'s palette colors array...'), function() {
                        it('It should store valid RGBA pixel color arrays in the bitmap\'s color palette pixels array.', function() {
                          for (i = 0; i < bitmap.colorPalettePixels.length; i++) {
                            expect(bitmap.colorPalettePixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                  it('Should have a property containing pixels and another with their buffers.', function() {
                    expect(bitmap.pixels.length).to.equal(bitmap.width * bitmap.height);
                    expect(bitmap.pixelBuffers.length).to.equal(bitmap.width * bitmap.height);
                    if (bitmap.pixels.length !== 0) {
                      describe(('If the ' + bitmapTwoReference + ' has pixels in it\'s image...'), function() {
                        it('It should store valid RGBA pixel color arrays in each element of the bitmap\'s pixel array.', function() {
                          for (i = 0; i < bitmap.pixels.length; i++) {
                            expect(bitmap.pixels[i].length).to.equal(4);
                            expect(bitmap.pixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                });
              }
            });
          });
          done();
        });
      });
    });
    describe(('When passed a ' + bitmapThreeReference + ' it...'), function() {
      it('Should parse the bitmap file.', function(done) {
        fs.readFile(bitmapThreeForTests, function(err, data) {
          if(err) throw err;
          var bitmap = bitmapParser(data);
          describe(('The bitmap parser should return an object with the header information of the ' + bitmapThreeReference + ' that...'), function() {
            it('Should have a property containing the endianness of the operating system being used.', function() {
              expect(bitmap.osEndianness).to.equal('LE');
            });
            it('Should have a property containing the type of the bitmap being parsed.', function() {
              expect(bitmap.type).to.equal('BM');
            });
            it('Should have a property containing the size of the bitmap being parsed (in bytes).', function() {
              expect(bitmap.sizeOfBitmapInBytes).to.equal(67922);
            });
            it('Should have a property containing the bitmap\'s pixels offset (in bytes).', function() {
              expect(bitmap.pixelOffsetInBytes).to.equal(122);
            });
            it('Should have a property containing the bitmap\'s DIB header size.', function() {
              expect(bitmap.dibHeaderSize).to.equal(108);
            });
            it('Should have a property containing the bitmap\'s DIB header type.', function() {
              expect(bitmap.dibHeaderType).to.equal('BITMAPV4HEADER');
              if (bitmap.dibHeaderType === 'BITMAPV4HEADER') {
                describe(('If the ' + bitmapThreeReference + ' has a "BITMAPV4HEADER" DIB header, bitmapParser() should return an object which also...'), function() {
                  it('Should have a property containing the bitmap\'s width (in pixels).', function() {
                    expect(bitmap.width).to.equal(150);
                  });
                  it('Should have a property containing the bitmap\'s height (in pixels).', function() {
                    expect(bitmap.height).to.equal(150);
                  });
                  it('Should have a property containing the number of color planes in the bitmap.', function() {
                    expect(bitmap.numberOfColorPlanes).to.equal(1);
                  });
                  it('Should have a property containing the bitmap\'s pixel color depth.', function() {
                    expect(bitmap.colorDepth).to.equal(24);
                  });
                  it('Should have a property containing the bitmap\'s compression method lookup index.', function() {
                    expect(bitmap.compressionMethodIndex).to.equal(0);
                  });
                  it('Should have a property containing the bitmap\'s compression type.', function() {
                    expect(bitmap.compressionType).to.equal('BI_RGB');
                  });
                  it('Should have a property containing the bitmap\'s raw data size.', function() {
                    expect(bitmap.rawDataSize).to.equal(67800);
                  });
                  it('Should have a property containing the bitmap\'s horizontal resolution (in pixels per meter).', function() {
                    expect(bitmap.horizontalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the bitmap\'s vertical resolution (in pixels per meter).', function() {
                    expect(bitmap.verticalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the number of colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfColorsInPalette).to.equal(0);
                  });
                  it('Should have a property containing the number of important colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfImportantColors).to.equal(0);
                  });
                  it('Should have a property containing the red mask value.', function() {
                    expect(bitmap.redMask).to.equal(1934772034);
                  });
                  it('Should have a property containing the green mask value.', function() {
                    expect(bitmap.greenMask).to.equal(0);
                  });
                  it('Should have a property containing the blue mask value.', function() {
                    expect(bitmap.blueMask).to.equal(0);
                  });
                  it('Should have a property containing the alpha mask value.', function() {
                    expect(bitmap.alphaMask).to.equal(0);
                  });
                  it('Should have a property containing the color space type.', function() {
                    expect(bitmap.colorSpaceType).to.equal(0);
                  });
                  it('Should have a property containing the CIEXYZ triplet values.', function() {
                    expect(bitmap.cieXYZ[0][0]).to.equal(0);
                    expect(bitmap.cieXYZ[0][1]).to.equal(0);
                    expect(bitmap.cieXYZ[0][2]).to.equal(0);
                    expect(bitmap.cieXYZ[1][0]).to.equal(0);
                    expect(bitmap.cieXYZ[1][1]).to.equal(0);
                    expect(bitmap.cieXYZ[1][2]).to.equal(0);
                    expect(bitmap.cieXYZ[2][0]).to.equal(0);
                    expect(bitmap.cieXYZ[2][1]).to.equal(0);
                    expect(bitmap.cieXYZ[2][2]).to.equal(2);
                  });
                  it('Should have a property containing the red gamma value.', function() {
                    expect(bitmap.redGamma).to.equal(0);
                  });
                  it('Should have a property containing the green gamma value.', function() {
                    expect(bitmap.greenGamma).to.equal(0);
                  });
                  it('Should have a property containing the blue gamma value.', function() {
                    expect(bitmap.blueGamma).to.equal(0);
                  });
                  it('Should have a property containing color palette pixels and another with their buffers.', function() {
                    expect(bitmap.colorPalettePixels.length).to.equal(0);
                    expect(bitmap.colorPalettePixelBuffers.length).to.equal(0);
                    if (bitmap.numberOfColorsInPalette !== 0) {
                      describe(('If the ' + bitmapThreeReference + ' has colors in it\'s palette colors array...'), function() {
                        it('It should store valid RGBA pixel color arrays in the bitmap\'s color palette pixels array.', function() {
                          for (i = 0; i < bitmap.colorPalettePixels.length; i++) {
                            expect(bitmap.colorPalettePixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                  it('Should have a property containing pixels and another with their buffers.', function() {
                    expect(bitmap.pixels.length).to.equal(bitmap.width * bitmap.height);
                    expect(bitmap.pixelBuffers.length).to.equal(bitmap.width * bitmap.height);
                    if (bitmap.pixels.length !== 0) {
                      describe(('If the ' + bitmapThreeReference + ' has pixels in it\'s image...'), function() {
                        it('It should store valid RGBA pixel color arrays in each element of the bitmap\'s pixel array.', function() {
                          for (i = 0; i < bitmap.pixels.length; i++) {
                            expect(bitmap.pixels[i].length).to.equal(4);
                            expect(bitmap.pixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                });
              }
            });
          });
          done();
        });
      });
    });
    describe(('When passed a ' + bitmapFourReference + ' it...'), function() {
      it('Should parse the bitmap file.', function(done) {
        fs.readFile(bitmapFourForTests, function(err, data) {
          if(err) throw err;
          var bitmap = bitmapParser(data);
          describe(('The bitmap parser should return an object with the header information of the ' + bitmapFourReference + ' that...'), function() {
            it('Should have a property containing the endianness of the operating system being used.', function() {
              expect(bitmap.osEndianness).to.equal('LE');
            });
            it('Should have a property containing the type of the bitmap being parsed.', function() {
              expect(bitmap.type).to.equal('BM');
            });
            it('Should have a property containing the size of the bitmap being parsed (in bytes).', function() {
              expect(bitmap.sizeOfBitmapInBytes).to.equal(15322);
            });
            it('Should have a property containing the bitmap\'s pixels offset (in bytes).', function() {
              expect(bitmap.pixelOffsetInBytes).to.equal(122);
            });
            it('Should have a property containing the bitmap\'s DIB header size.', function() {
              expect(bitmap.dibHeaderSize).to.equal(108);
            });
            it('Should have a property containing the bitmap\'s DIB header type.', function() {
              expect(bitmap.dibHeaderType).to.equal('BITMAPV4HEADER');
              if (bitmap.dibHeaderType === 'BITMAPV4HEADER') {
                describe(('If the ' + bitmapFourReference + ' has a "BITMAPV4HEADER" DIB header, bitmapParser() should return an object which also...'), function() {
                  it('Should have a property containing the bitmap\'s width (in pixels).', function() {
                    expect(bitmap.width).to.equal(50);
                  });
                  it('Should have a property containing the bitmap\'s height (in pixels).', function() {
                    expect(bitmap.height).to.equal(100);
                  });
                  it('Should have a property containing the number of color planes in the bitmap.', function() {
                    expect(bitmap.numberOfColorPlanes).to.equal(1);
                  });
                  it('Should have a property containing the bitmap\'s pixel color depth.', function() {
                    expect(bitmap.colorDepth).to.equal(24);
                  });
                  it('Should have a property containing the bitmap\'s compression method lookup index.', function() {
                    expect(bitmap.compressionMethodIndex).to.equal(0);
                  });
                  it('Should have a property containing the bitmap\'s compression type.', function() {
                    expect(bitmap.compressionType).to.equal('BI_RGB');
                  });
                  it('Should have a property containing the bitmap\'s raw data size.', function() {
                    expect(bitmap.rawDataSize).to.equal(15200);
                  });
                  it('Should have a property containing the bitmap\'s horizontal resolution (in pixels per meter).', function() {
                    expect(bitmap.horizontalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the bitmap\'s vertical resolution (in pixels per meter).', function() {
                    expect(bitmap.verticalResolution).to.equal(2834);
                  });
                  it('Should have a property containing the number of colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfColorsInPalette).to.equal(0);
                  });
                  it('Should have a property containing the number of important colors in the bitmap\'s color palette.', function() {
                    expect(bitmap.numberOfImportantColors).to.equal(0);
                  });
                  it('Should have a property containing the red mask value.', function() {
                    expect(bitmap.redMask).to.equal(1934772034);
                  });
                  it('Should have a property containing the green mask value.', function() {
                    expect(bitmap.greenMask).to.equal(0);
                  });
                  it('Should have a property containing the blue mask value.', function() {
                    expect(bitmap.blueMask).to.equal(0);
                  });
                  it('Should have a property containing the alpha mask value.', function() {
                    expect(bitmap.alphaMask).to.equal(0);
                  });
                  it('Should have a property containing the color space type.', function() {
                    expect(bitmap.colorSpaceType).to.equal(0);
                  });
                  it('Should have a property containing the CIEXYZ triplet values.', function() {
                    expect(bitmap.cieXYZ[0][0]).to.equal(0);
                    expect(bitmap.cieXYZ[0][1]).to.equal(0);
                    expect(bitmap.cieXYZ[0][2]).to.equal(0);
                    expect(bitmap.cieXYZ[1][0]).to.equal(0);
                    expect(bitmap.cieXYZ[1][1]).to.equal(0);
                    expect(bitmap.cieXYZ[1][2]).to.equal(0);
                    expect(bitmap.cieXYZ[2][0]).to.equal(0);
                    expect(bitmap.cieXYZ[2][1]).to.equal(0);
                    expect(bitmap.cieXYZ[2][2]).to.equal(2);
                  });
                  it('Should have a property containing the red gamma value.', function() {
                    expect(bitmap.redGamma).to.equal(0);
                  });
                  it('Should have a property containing the green gamma value.', function() {
                    expect(bitmap.greenGamma).to.equal(0);
                  });
                  it('Should have a property containing the blue gamma value.', function() {
                    expect(bitmap.blueGamma).to.equal(0);
                  });
                  it('Should have a property containing color palette pixels and another with their buffers.', function() {
                    expect(bitmap.colorPalettePixels.length).to.equal(0);
                    expect(bitmap.colorPalettePixelBuffers.length).to.equal(0);
                    if (bitmap.numberOfColorsInPalette !== 0) {
                      describe(('If the ' + bitmapFourReference + ' has colors in it\'s palette colors array...'), function() {
                        it('It should store valid RGBA pixel color arrays in the bitmap\'s color palette pixels array.', function() {
                          for (i = 0; i < bitmap.colorPalettePixels.length; i++) {
                            expect(bitmap.colorPalettePixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.colorPalettePixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                  it('Should have a property containing pixels and another with their buffers.', function() {
                    expect(bitmap.pixels.length).to.equal(bitmap.width * bitmap.height);
                    expect(bitmap.pixelBuffers.length).to.equal(bitmap.width * bitmap.height);
                    if (bitmap.pixels.length !== 0) {
                      describe(('If the ' + bitmapFourReference + ' has pixels in it\'s image...'), function() {
                        it('It should store valid RGBA pixel color arrays in each element of the bitmap\'s pixel array.', function() {
                          for (i = 0; i < bitmap.pixels.length; i++) {
                            expect(bitmap.pixels[i].length).to.equal(4);
                            expect(bitmap.pixels[i][0]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][1]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][2]).to.be.within(0, 255);
                            expect(bitmap.pixels[i][3]).to.be.within(0, 255);
                          }
                        });
                      });
                    }
                  });
                });
              }
            });
          });
          done();
        });
      });
    });
  });
});
