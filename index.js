var imageMagick = require('gm').subClass({ imageMagick: true });

var defaults = {
  width: 120,
  height: 100,
  align: 'center'
};

function isString(value) {
  return typeof value === 'string';
}

function extend(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function (source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

module.exports = function createThumb(buf, options, cb) {

  var opt = extend({}, defaults, options);
  var w = isString(opt.width) ? parseInt(opt.width, 10) : opt.width;
  var h = isString(opt.height) ? parseInt(opt.height, 10) : opt.height;
  var w1, h1;
  var xoffset = 0;
  var yoffset = 0;
  var img = imageMagick(buf, 'thumb.png');

  img.size(function (err, size) {
    if (err) { return cb(err); }

    if (size.width < size.height) {
      w1 = w;
      h1 = Math.floor(size.height * (w / size.width));
      if (h1 < h) {
        w1 = Math.floor(w1 * (((h - h1) / h) + 1));
        h1 = h;
      }
    } else if (size.width > size.height) {
      h1 = h;
      w1 = Math.floor(size.width * (h / size.height));
      if (w1 < w) {
        h1 = Math.floor(h1 * (((w - w1) / w) + 1));
        w1 = w;
      }
    } else if (size.width == size.height) {
      var bigger = (w > h ? w : h);
      w1 = bigger;
      h1 = bigger;
    }

    if (opt.align === 'center') {
      if (w < w1) {
        xoffset = (w1 - w) / 2;
      }
      if (h < h1) {
        yoffset = (h1 - h) / 2;
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

