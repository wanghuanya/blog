/*------------------------------------------------------------------
Project:        Paperclip
Author:         Simpleqode.com
URL:            http://simpleqode.com/
                https://twitter.com/YevSim
                https://www.facebook.com/simpleqode
Version:        1.3.2
Created:        11/03/2014
Last change:    16/11/2015
-------------------------------------------------------------------*/

/**
 * Navbar
 */


/* Navbar shadow */

$(function() {
  $(".navbar-default").wrap("<div class='navbar-container'></div>");
  $(".navbar-container").append("<div class='navbar-shadow'></div>");
});


/* Navbar search form toggle */

$(function() {
  $(document).click(function(e) {
    var target = $(e.target),
        searchToggle = target.closest(".navbar-search__toggle"),
        searchForm = target.closest(".navbar-search");

    // Click on the button to show/hide the form
    if (searchToggle.length) {
      $(".navbar-search").toggle();
    }

    // Click outside the form to hide it
    if(!searchToggle.length && !searchForm.length && $(".navbar-search").css("display") != "hidden") {
      $(".navbar-search").hide();
    }
  });
});


/* Dropdown submenu positioning (left or right) */

$(function() {
  $("ul.dropdown-menu a[data-toggle=dropdown]").hover(function() {
    var menu = $(this).parent().find("ul"),
        menupos = menu.offset();

    if ((menupos.left + menu.width()) + 30 > $(window).width()) {
      $(this).parent().addClass('pull-left');   
    }

    return false;
  });
});


/* Toggle dropdown menus on hover instead of on click */

/* $(".nav .dropdown").hover(function() {
  $(this).find(".dropdown-toggle").dropdown("toggle");
}); */

// Where 991 is the max width of small screens (tablets)

$(function(){
    $('.dropdown').hover(function() {
        if ($(window).width() > 991) $(this).addClass('open');
    },
    function() {
        if ($(window).width() > 991) $(this).removeClass('open');
    });
});


/**
 * Footer
 */

/* Sticky footer */

$(function() {
  function stickyFooter() {
    var footer = $("footer");
    var footerHeight = footer.outerHeight(true);
    $("body").css("margin-bottom", footerHeight);
  };

  setTimeout(stickyFooter,200);

  $(window).resize(function() {
    setTimeout(stickyFooter, 200);
  });
});


/* Toggle footer columns content on click (for extra small screens) */

$(function() {
  $(".footer-item__title").click(function() {
    var windowWidth = $(window).width();
    var thisContent = $(this).next();

    if (windowWidth <= 767) {
      $(".footer-item__content").not(thisContent).slideUp();
      $(".footer-item__title").not(this).removeClass("expanded");
      $(this).toggleClass("expanded").next().slideToggle();
    }
  });

  $(window).resize(function() {
    if ( $(this).width() > 767 ) {
      $(".footer-item__content").css("display", "block");
    } else {
      $(".footer-item__content").css("display", "none");
    }
  });
});


/**
 * Smooth scroll to anchor
 */

$(function() {
  $('a[href*=#]').not('[href=#], [data-toggle], [data-slide]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

      if (target.length) {
        $('html,body').animate({
          scrollTop: (target.offset().top - 20)
        }, 1000);

        return false;
      }
    }
  });
});


/**
 * Initialize Tooltips & Popovers
 */

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
});


/**
 * Initialize and calculate styles & offsets for Bootstrap Affix
 */

$(function() {

  $('[data-spy="affix"]').each(function() {
    var elem = $(this);

    // Set offsets 

    elem.affix({
      offset: {
        top: function() {
          return (this.top = elem.offset().top - 40);
        },
        bottom: function() {
          return (this.bottom = $("footer").outerHeight(true));
        }
      }
    });

    // Apply styles

    elem.on({
      "affix.bs.affix": function() {
        elem.css("width", elem.width());
      },
      "affixed.bs.affix": function() {
        elem.css({
          "position": "fixed",
          "top": 40
        });
      },
      "affixed-top.bs.affix": function() {
        elem.attr("style", "");
      }
    });

  });

});


/**
 * Blackout
 */

$(function() {
  $(".blackout").each(function() {
    var elem = $(this),
        blackoutMax = elem.data("blackout-max") ? elem.data("blackout-max") / 100 : 1;

    elem.prepend("<div class='blackout__layer'></div>");

    $(window).scroll(function() {
      var elemBottomOffset = elem.offset().top + elem.height() - $(window).scrollTop();

      if (elemBottomOffset > 0 && elemBottomOffset < elem.height()) {
        var coef = 1 - (elemBottomOffset / elem.height());
            coef = Math.min(coef, blackoutMax);
        
        elem.children(".blackout__layer").css("opacity", coef);
      } else if (elemBottomOffset >= elem.height()) {
        elem.children(".blackout__layer").css("opacity", 0);
      }
    });

  });
});


/**
 * Background Parallax
 */

$(function() {
  $(".bg-parallax").each(function() {

    // Create layer

    var parallaxLayer = "<div class='bg-parallax__layer'></div>";
    $(this).prepend(parallaxLayer);

    var elem = $(this);
    var layer = $(this).find(".bg-parallax__layer");

    // Set background image for the layer

    var backgroundImage = elem.css("background-image");
    layer.css("background-image", backgroundImage);
    elem.css("background-image", "none");

    function updateBackgroundPosition() {
      var scrollAdjust = elem.offset().top - $(window).scrollTop();
          scrollAdjust *= -0.5;

        layer.css({
          "transform": "translate(0, " + scrollAdjust + "px)",
          "-ms-transform": "translate(0, " + scrollAdjust + "px)",
          "-webkit-transform": "translate(0, " + scrollAdjust + "px)"
        });
    };

    // Update elem background position on load

    updateBackgroundPosition();

    // Update elem background posistion on resize & scroll

    $(window).on({
      resize: updateBackgroundPosition,
      scroll: updateBackgroundPosition
    });

  });
});


/**
 * Comments
 */

/* New comment */

$(function() {

  // Expand textarea on focus, enable submit button on input

  $("form[name='comments__new'] textarea").on({
    focus: function() {
      if (!$(this).val()) {
        $(this).data("original-height", $(this).outerHeight());
      }
      $(this).animate({ "height": "68px" }, 300);
    },
    blur: function() {
      if (!$(this).val()) {
        $(this).animate({ "height": $(this).data("original-height") }, 300);
        $(this).parents("form").find("button[type='submit']").attr("disabled", "disabled");
      }
    },
    input: function() {
      $(this).parents("form").find("button[type='submit']").removeAttr("disabled");
    }
  });
});


/**
 * Homepage
 */

/* Home slider initialization */

$('#home-slider').carousel({
  interval: 5000
});


/**
 * Responsive showcase
 */

$(function() {

  function toggleDevice(device) {

    // Change active icon
    $(".responsive-showcase__devices > li")
      .removeClass("active")
      .filter("[data-device='" + device + "']").addClass("active");

    // Change image
    $(".responsive-showcase__images > img")
      .hide()
      .filter("#" + device).fadeIn();
  }
  
  // Load an active device image on load
  var device = $(".responsive-showcase__devices > .active").data("device");
  toggleDevice(device);

  // Toggle device image on click
  $(".responsive-showcase__devices > li").click(function() {
    var device = $(this).data("device");
    toggleDevice(device);
  });

});


/**
 * Search results
 */

$(function() {
  $(".search-results-filter__sort > li").click(function() {
    $(this).addClass("active").siblings("li").removeClass("active");
    return false;
  });
});


/**
 * Shop
 */

/* Total price calculation */

/*
 js-shop__item
 js-shop-item__price
 js-shop-item__quantity
 js-shop__total-price
 */

$(function() {

  // Calculate total price 

  function calcTotal() {
    var totalPrice = 0;

    $(".js-shop__item").each(function() {
      var price = +$(this).find(".js-shop-item__price").text(),
          quantity = +$(this).find(".js-shop-item__quantity").val();

      totalPrice += price * quantity;
    });

    $(".js-shop__total-price").text(totalPrice);
  };

  // Update total price on page load

  calcTotal();

  // Update total price on quantity change

  $(".js-shop-item__quantity").change(function() {
    calcTotal();
  });

});