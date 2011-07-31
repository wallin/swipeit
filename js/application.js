$.fn.reverse = [].reverse;

var NUM_COLUMNS = 3;
var NUM_PRODUCTS = 9;
var SWIPE_IN_DELAY = 200;
var SWIPE_OUT_DELAY = 150;

var tmpl = {
  item: '<li><img src="img/product.jpg"></li>'
};


var Swipe = {
  el: null,

  inClass: 'out-left',
  outClass: 'out-right',

  enter: function () {
    // Remove any existing columns
    var $existing = $('ul.col');
    if ($existing.length > 0) {
      Swipe.leave();
      _.delay(Swipe.enter, NUM_COLUMNS * SWIPE_OUT_DELAY);
      return;
    }

    // Add fresh columns
    var $cols = [];
    for (var i = 0; i < NUM_COLUMNS; i++) {
      $cols[i] = $('<ul>').attr('class', 'col ' + Swipe.inClass);
      Swipe.el.append($cols[i]);
    }

    // Add products
    for (i = 0; i < NUM_PRODUCTS; i++) {
      var $col = $cols[i % NUM_COLUMNS];
      $col.append($(tmpl.item));
    }

    var len = $cols.length;
    var time = 0;
    _.each($cols, function (el, i) {
      _.delay(function () {
        el.attr('class', 'col col' + (len - i));
      }, time += SWIPE_IN_DELAY);
    });
  },


  leave: function () {
    var $cols = $('ul.col');
    var len = $cols.length;
    var time = 0;
    $cols.each(function (i, el) {
      _.delay(function () {
        $(el).addClass(Swipe.outClass);
      }, time += SWIPE_OUT_DELAY);
    });

    // Remove cols
    _.delay(function () {
      $cols.remove();
    }, time * 2);
  }
};

$(function () {
  Swipe.el = $('#wrapper');

  $('#swipe-in').click(Swipe.enter);

  $('#swipe-out').click(Swipe.leave);

  $('#effect').change(function(e) {
    Swipe.outClass = $(e.target).val();
  });
});

