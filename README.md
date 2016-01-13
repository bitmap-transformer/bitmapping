# Bitmap Transformer Console Application

Code Fellows 401 Advanced Software Development

Bitmap Transformer Assignment, January 2016

This application can help perform a few basic image processing transformations on bitmap files that are BM bitmaps, that have a 'BITMAPINFOHEADER' or 'BITMAPV4HEADER' DIB header, that have 8 or 24 bit color depth, and that have or do not have a color palette.  Accepted bitmaps may have any width or height although smaller sized bitmaps are recommended for faster processing.

###Installation:

This application can be installed globally via [npm](https://www.npmjs.com/package/basic-bitmap-transformer) using the command:

`$npm install -g basic-bitmap-transformer`

###Useage:

$basicbitmaptransformer [bitmapFile] [transformation]

Note: The [bitmapFile] provided must be located in the current directory or must be prefixed by the appropriate relative path.  For example, if the file bitmap.bmp is located in the current directory you could simply specify 'bitmap.bmp' for the [bitmapFile] argument, but if the file bitmap.bmp were in an 'image' folder inside the current directory then you would need to prefix 'image/' to the file name for the [bitmapFile] argument ('images/bitmap.bmp').

###Transformations:

Color Palette Transformations:

'greyscalePalette' - converts the bitmap's color palette to greyscale.

'redShiftPalette' - converts the bitmap's color palette to the red channel.

'greenShiftPalette' - converts the bitmap's color palette to the green channel.

'blueShiftPalette' - converts the bitmap's color palette to the blue channel.

Pixel Transformations:

'greyscalePixels' - converts the bitmap's pixels to greyscale.

'redShiftPixels' - converts the bitmap's pixels to the red channel.

'greenShiftPixels' - converts the bitmap's pixels to the green channel.

'blueShiftPixels' - converts the bitmap's pixels to the blue channel.


####Authors:

[James Mason](https://github.com/jhm90), [Stephen Salzer](https://github.com/scoobahsteve), [Erika Hokanson](https://github.com/erikawho)
