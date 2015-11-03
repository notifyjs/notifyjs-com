
function initCodeRunner() {
  prettyPrint();
  var addCSS = function(e) {
    var pre = $(this);
    return $.notify.insertCSS(pre.text());
  };
  var ranSnippet = false;
  var runSnippet = function(e) {
    if (e && e.type === 'click') {
      ranSnippet = true;
    }
    var pre = $(this);
    pre.addClass('running');
    eval(pre.text());
    setTimeout(function() {
      return pre.removeClass('running');
    }, 500);
    return null;
  };
  setTimeout(function() {
    if (!ranSnippet) {
      return $.notify('Tip: You can run the code snippets by clicking them', {
        className: 'info',
        position: 'b l'
      });
    }
  }, 30 * 1000);

  $(document).on('click', '.prettyprint.runnable', runSnippet);
  $(".prettyprint.auto-run").each(runSnippet);
  $(".prettyprint.auto-add").each(addCSS);
}

function initDownloader() {
  $(document).on('click', "a[data-download]", function(e) {
    var name, url;
    if (!$.compile) {
      return true;
    }
    url = $(this).attr('href');
    name = $(this).attr('data-filename');
    $.compile.fetch('core', url).download('core', name);
    ga('send', 'event', 'download', name);
    e.preventDefault();
    return false;
  });
  $(document).on('click', "a[data-minify-download]", function(e) {
    var name, url;
    if (!$.compile) {
      return true;
    }
    url = $(this).attr('href');
    name = $(this).attr('data-filename');
    $.compile.error(function(msg) {
      return alert(msg);
    }).fetch('core', url).run('uglify', {
      src: 'core',
      dest: 'core-min'
    }).download('core-min', name).get('core-min', function() {
      return ga('send', 'event', 'download', name);
    });
    e.preventDefault();
    return false;
  });
}

function initPosChooser() {

  var mod = function(v, m) {
    return (v < 0 ? m : 0) + v % m;
  };

  var currPos, currType, hPos, i, j, len, len1, mPos, open, p1, p2, p2s, positions, vPos;
  //disable on IE
  if (/MSIE (\d)/.test(window.navigator.userAgent) && parseInt(RegExp.$1, 10) < 8) {
    return;
  }
  //build a all permutations of all positions
  positions = [];
  mPos = ['top', 'right', 'bottom', 'left'];
  vPos = ['top', 'middle', 'bottom'];
  hPos = ['left', 'center', 'right'];
  for (i = 0, len = mPos.length; i < len; i++) {
    p1 = mPos[i];
    p2s = vPos.indexOf(p1) >= 0 ? hPos : vPos;
    if (p1 === 'bottom' || p1 === 'left') {
      p2s.reverse();
    }
    for (j = 0, len1 = p2s.length; j < len1; j++) {
      p2 = p2s[j];
      positions.push(p1 + " " + p2);
    }
  }
  //default position
  currPos = 'top left';
  currType = 'elem';
  open = function() {
    var opts;
    opts = {
      position: currPos
    };
    if (currType === 'elem') {
      return $(".pos-chooser-demo").notify("" + currPos, opts);
    } else {
      return $.notify("" + currPos, opts);
    }
  };
  //init knob and cycle though position
  $(".pos-chooser").knob({
    stopper: false,
    change: function(val) {
      val = mod(val, positions.length);
      currPos = positions[val];
      return open();
    }
  });
  $(".pos-chooser").siblings().first().addClass(".pos-chooser-dial");
  return $(document).on('click', 'input[name=pos-type]', function() {
    currType = $(this).val();
    return open();
  });
};

function init() {

  initCodeRunner();
  initDownloader();
  initPosChooser();

  //notify defaults
  $.notify.defaults({
    className: 'success'
  });

  //@jpillora's book ad
  $.notify.addStyle('gswg', {
    html: "<div>\n  <div class=\"content clearfix\">\n    <div class=\"cover\"></div>\n    <div class=\"text\">\n      <div>Checkout</div>\n      <div class=\"title\">Getting Started with Grunt: The JavaScript Task Runner</div>\n      <div>Get the first chapter for free!</div>\n      <div>\n        <a target=\"_blank\" href=\"http://gswg.io\">\n          <button data-notify-text></button>\n        </a>\n        <button>No thanks</button>\n      </div>\n    </div>\n  </div>\n</div>"
  });
  $(document).on('click', '.notifyjs-gswg-base button', function() {
    return $(this).trigger('notify-hide');
  });
  return setTimeout(function() {
    return $.notify("http://gswg.io", {
      position: 'b r',
      style: 'gswg',
      autoHideDelay: 10 * 1000,
      clickToHide: false
    });
  }, 15 * 1000);

  //mouse animation
  var mouseDemo = $(".demo-mouse");
  return $('.summary').hover(function() {
    return mouseDemo.addClass("over");
  }, function() {
    return mouseDemo.removeClass("over");
  });
};

//init on DOM ready
$(init);
