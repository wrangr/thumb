var _ = require('lodash');
var imageMagick = require('gm').subClass({ imageMagick: true });

module.exports = function createThumb(buf, opt, cb) {
  var w = _.isString(opt.width) ? parseInt(opt.width, 10) : opt.width;
  var h = _.isString(opt.height) ? parseInt(opt.height, 10) : opt.height;
  var align = opt.align || 'center';
  var w1, h1;
  var xoffset = 0;
  var yoffset = 0;
  var img = imageMagick(buf, 'thumb.png');

  img.size(function (err, size) {
    if (err) { return cb(err); }

    if (size.width < size.height) {
      w1 = w;
      h1 = Math.floor(size.height * (w/size.width));
      if (h1 < h) {
        w1 = Math.floor(w1 * (((h-h1)/h) + 1));
        h1 = h;
      }
    } else if (size.width > size.height) {
      h1 = h;
      w1 = Math.floor(size.width * (h/size.height));
      if (w1 < w) {
        h1 = Math.floor(h1 * (((w-w1)/w) + 1));
        w1 = w;
      }
    } else if (size.width == size.height) {
      var bigger = (w>h?w:h);
      w1 = bigger;
      h1 = bigger;
    }

    if (align == 'center') {
      if (w < w1) {
        xoffset = (w1-w)/2;
      }
      if (h < h1) {
        yoffset = (h1-h)/2;
      }
    }

    img
      .quality(100)
      .in('-size', w1 + 'x' + h1)
      .scale(w1, h1)
      .crop(w, h, xoffset, yoffset)
      .noProfile()
      .toBuffer(cb);
  });
};

