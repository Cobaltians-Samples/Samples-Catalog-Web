var app = {
  /* This code below, combined with the touch module of zepto helps in resolving issues
     with fastclick on android devices : some devices receive "tap" event before "click" and
     some don't. ensure only one event is fired in all cases.
  */
  touchTimer: null,
  touch: function(selector, touchHandler, allowDefault) {
    var preventDefault = allowDefault ? false : true;

    $(selector).each(function(i, elem) {
      var elem = $(elem);
      var touchup = function() {
        elem.removeClass('touched');
      };
      var touching = function(e) {
        if (!elem.hasClass('touched')) {
          elem.addClass('touched');
          clearTimeout(app.touchTimer);
          app.touchTimer = setTimeout(touchup, 1000);
          touchHandler.apply([this, e]);

        }
        if (preventDefault)
          return false;
      }
      elem.unbind('tap').on('tap', touching);
      elem.unbind('click').on('click', touching);
    });
  },

  /*
      initPage binds some common links like push and pop and send the page title to the native side
   */
  initPage: function(title) {

    app.touch('a.push', function() {
      if (!$(this).hasClass('disabled')) {
        cobalt.navigate.push({
          page: $(this).attr('data-href'),
          controller: $(this).attr('data-classid')
        });
      }
    });
    app.touch('a.pop', function() {
      cobalt.navigate.pop({
        page: $(this).attr('data-href'),
        controller: $(this).attr('data-classid')
      });
    });
    app.touch('a.dismiss', function() {
      cobalt.navigate.dismiss();
    });
    app.touch('a.modal', function() {
      cobalt.navigate.modal({
        page: $(this).attr('data-href'),
        controller: $(this).attr('data-classid')
      });
    });

    if (title) {
      cobalt.nativeBars.setBarContent({
        title: title
      });
    }
  },
  /* change font size on body. used in events demo page */
  setZoom: function(zoomLevel) {
    try {
      document.querySelectorAll('body')[0].style.fontSize = zoomLevel + "px"

    } catch (e) {
      cobalt.log(e);
    }
  },

  /* a small assert function used in localStorage and callbacks pages */
  assertEqual: function(testID, func_or_result, expectedResult) {
    try {
      var result = ( typeof func_or_result == "function") ? func_or_result() : func_or_result;
      cobalt.log('testing', result, 'vs', expectedResult);
      if (result === expectedResult) {
        cobalt.toast('test #' + testID + " success! ");
        return true;
      } else {
        cobalt.toast('test #' + testID + " failed! ");
        cobalt.log(result, typeof  result, " != ", expectedResult, typeof  expectedResult);
      }
    } catch (e) {
      cobalt.toast('test #' + testID + " failed! " + e)
    }
    return false;
  }


}