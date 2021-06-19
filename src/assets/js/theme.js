$(function () { });

var $params = function (obj) {
  if (obj == null || obj == undefined) return "";
  return jQuery.param(obj);
};

var page_refresh_menu = function () {
  var sideMenu = $(".metismenu");
  $('.menu-container').hide();
  try {
    sideMenu.metisMenu("dispose");
  } catch(e){ }
  //
  setTimeout(function () {
    sideMenu.find('li.active').parents('ul').attr('aria-expanded', true).parents('li').addClass('active');
    sideMenu.metisMenu({
      toggle: true,
      activeClass: "active",
      collapseInClass: "in",
      collapsingClass: "collapsing"
    });
    $('.menu-container').delay(100).fadeIn(200);
  });
};

var folder_view_refresh_menu = function () {
    $('.metisFolder').metisMenu({
      toggle: false
    });
}

var page_init_menu = function () {
  var sideMenu = $(".metismenu");
  sideMenu.metisMenu({
    toggle: true,
    activeClass: "active",
    collapseInClass: "in",
    collapsingClass: "collapsing"
  });
};

var page_init = function () {
  //page_init_menu();
  //
  page_resize();
  page_init_cheque_toolbar();
  lov_read_only();
};

var get_win_width = function () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
};

var sidemenu_hide = function () {
  $(".side-nav")
    .css("width", "0")
    .hide();
  $(".master-content,.page-toolbar,footer,header").css(
    "width",
    get_win_width() + "px"
  );
  sidemenuW = 0;
};

var sidemenu_show = function () {
  sidemenuW = 300;
  $(".side-nav")
    .show()
    .css("width", sidemenuW + "px");
  $(".master-content,.page-toolbar,footer,header").css(
    "width",
    get_win_width() - sidemenuW + "px"
  );
};

var page_toggle_side_menu = function () {
  var sidemenuW = $(".side-nav").width();
  if (sidemenuW > 0) {
    sidemenu_hide();
  } else {
    sidemenu_show();
  }
};

var page_available_height = function () {
  var vpH = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  var headerH = $(".header").height();
  var footerH = $(".header").height();
  return vpH - headerH - footerH;
};

var page_resize = function () {
  var speed = 500;
  var vpW = get_win_width();
  var sidemenuW = $(".side-nav").width();
  var sidemenuH = $(".side-nav").height();

  //console.log("sidemenuW: " + sidemenuW);
  //console.log("sidemenuH:" + sidemenuH);

  //
  $(".master-content,.page-toolbar,footer,header").css(
    "width",
    vpW - sidemenuW
  );
  $(".master-content").css("height", page_available_height());
  $(".page-content").css("height", $(".master-content").height() - 50);
  $(".metismenu").css("height", sidemenuH - 105);
  //

  //
  if (vpW < 1024) {
    sidemenu_hide();
  }
  //
  $(".navbar-toggle").off("click");
  $(".navbar-toggle").click(function () {
    page_toggle_side_menu();
  });
};

var print_pdf = function (url) {
  // var iframe = this._printIframe;
  // if (!this._printIframe) {
  //     iframe = this._printIframe = document.createElement('iframe');
  //     document.body.appendChild(iframe);

  //     iframe.style.display = 'none';
  //     iframe.id = 'havij';
  //     iframe.name = 'havij';

  // }
  // iframe.src = 'https://research.google.com/pubs/archive/44678.pdf';

  // let that = this;
  // var callbacks = {
  // myCallback: function (print) {
  //      
  //     print.load();
  // }
  // };

  // window.addEventListener("message", function (ev) {
  //      
  //     callbacks[ev.data](self.document.havij);
  // }, false);
  // iframe.onload = function () {
  //     setTimeout(function () {
  //         self.focus();
  // self.document.open();
  // self.document.write('\<script>window.print();\<\/script>');
  // self.document.close();

  // self.print();
  // iframe.focus();
  // self.location = '/';
  // document.havij.print();
  // window.postMessage('myCallback', '*');

  // iframe.print();
  //     }, 100);
  // };
  var win = window.open(url);
  win.onload = function () {
    setTimeout(function () {
      alert("printing...");
      win.focus();
      win.print();
    }, 100);
  };
};

$(window).resize(function () {
  page_resize();
});

function page_init_cheque_toolbar() {
  $(".toggle-tool-box").click(function () {
    console.log("clicked toggle box");
    $(".toolbox-container").toggle();
  });
}
function lov_read_only() { }
