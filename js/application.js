$.fn.reverse = [].reverse;

var NUM_PRODUCTS = 9;

var tmpl = {
  item: '<li><img src="img/product.jpg"></li>'
};


var Swipe = function (opts) {
  opts = opts || {};
  this.el = opts.el;
  this.inClass = opts.inClass || 'out-left';
  this.outClass = opts.outClass || 'out-right';
  this.onAdd = opts.onAdd || function () {};
  this.numCols = opts.numCols || this.NUM_COLUMNS;
  _.bindAll(this, 'enter', 'leave');
};

Swipe.prototype = {
  NUM_COLUMNS: 4,
  SWIPE_IN_DELAY: 200,
  SWIPE_OUT_DELAY: 150,
  enter: function (data) {
    var self = this;
    // Remove any existing columns
    var $existing = $('ul.col', this.el);
    if ($existing.length > 0) {
      this.leave();
      _.delay(function () {
        self.enter(data);
      }, this.numCols * this.SWIPE_OUT_DELAY);
      return;
    }

    // Add fresh columns
    var $cols = [];
    for (var i = 0; i < this.numCols; i++) {
      $cols[i] = $('<ul>').attr('class', 'col ' + this.inClass);
      this.el.append($cols[i]);
    }

    // Add data
    for (i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      var $col = $cols[i % this.numCols];
      $col.append(this.onAdd(item, i));
    }

    var len = $cols.length;
    var time = this.SWIPE_IN_DELAY * this.numCols;
    _.each($cols, function (el, i) {
      _.delay(function () {
        el.attr('class', 'col col' + (i + 1));
      }, time -= self.SWIPE_IN_DELAY);
    });
  },

  leave: function () {
    var self = this;
    var $cols = $('ul.col', this.el);
    var len = $cols.length;
    var time = this.SWIPE_OUT_DELAY * this.numCols;
    $cols.each(function (i, el) {
      _.delay(function () {
        $(el).addClass(self.outClass);
      }, time -= self.SWIPE_OUT_DELAY);
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

  $('#effect').change(function (e) {
    swipe.outClass = $(e.target).val();
  });
});

