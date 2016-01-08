var reader = require(__dirname + '/lib/bitmap_data_reader.js').readBitmap;

reader(__dirname + '/img/bitmap1.bmp');

var bitmap = require(__dirname + '/lib/bitmap_data_reader.js').getBitmap;
bitmap = bitmap(__dirname + '/img/bitmap1.bmp');
