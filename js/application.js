$.fn.reverse = [].reverse;

var NUM_PRODUCTS = 9;

var tmpl = {
  item: '<li><img src="img/product.jpg"></li>'
};

var Swipe = function (opts) {
  opts = opts || {};
  this.el = opts.el;
  this.inClass = opts.inClass || 'in';
  this.outClass = opts.outClass || 'out';
  this.onAdd = opts.onAdd || function () {};
  this.numCols = opts.numCols || this.NUM_COLUMNS;
  _.bindAll(this, 'enter', 'leave');
};

Swipe.prototype = {
  NUM_COLUMNS: 4,
  SWIPE_IN_DELAY: 200,
  SWIPE_OUT_DELAY: 150,
  enter: function (data, direction) {
    if (data == null || (_.isArray(data) && data.length === 0)) {
      return;
    }
    if (direction !== 'left') {
      direction = 'right';
    }

    var self = this;
    // Remove any existing columns
    var $existing = $('ul.col', this.el);
    if ($existing.length > 0 && !$existing.hasClass('deleted')) {
      this.leave(direction);
      _.delay(function () {
        self.enter(data, direction);
      }, this.SWIPE_OUT_DELAY);
      return;
    }

    // Add fresh columns
    var $cols = [];
    for (var i = 0; i < this.numCols; i++) {
      $cols[i] = $('<ul>').attr('class', 'col ' + this.inClass + '-' + direction);
      this.el.append($cols[i]);
    }

    // Add data
    for (i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      var $col = $cols[i % this.numCols];
      $col.append(this.onAdd(item, i));
    }

    var len = $cols.length;
    var time = direction === 'right' ? this.SWIPE_IN_DELAY * this.numCols : 0;
    var mult = direction === 'right' ? -1 : 1;
    _.each($cols, function (el, i) {
      _.delay(function () {
        el.attr('class', 'col col' + (i + 1));
      }, time += self.SWIPE_IN_DELAY * mult);
    });
  },

  leave: function (direction) {
    if (direction !== 'left') {
      direction = 'right';
    }
    var self = this;
    var $cols = $('ul.col', this.el).addClass('deleted');
    var len = $cols.length;
    var time = direction === 'right' ? this.SWIPE_OUT_DELAY * this.numCols : 0;
    var mult = direction === 'right' ? -1 : 1;
    $cols.each(function (i, el) {
      _.delay(function () {
        $(el).addClass(self.outClass + '-' + direction);
      }, time += self.SWIPE_OUT_DELAY * mult);
    });

    // Remove cols
    _.delay(function () {
      $cols.remove();
    }, this.SWIPE_OUT_DELAY * this.numCols * 2);
  }
};

$(function () {
  swipe = new Swipe({
    el: $('#wrapper'),
    onAdd: function (item) {
      return $(tmpl.item);
    }
  });
  data = new Array(NUM_PRODUCTS);
  $('#swipe-in').click(function () {
    swipe.enter(data);
  });

  $('#swipe-out').click(swipe.leave);
});

