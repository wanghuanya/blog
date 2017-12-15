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

/* -------------------- *\
  #PORTFOLIO
\* -------------------- */

/* Requires isotope.pkgd.min.js & imagesloaded.pkgd.min.js */

/**
 * Isotope filtering
 */

// Init Isotope
var $container = $('#isotope-container').imagesLoaded( function() {
  $container.isotope({
    itemSelector: '.isotope-item',
    layoutMode: 'fitRows'
  });
});

// Filter items on click
$(".portfolio__nav > li").click(function() {

  // Filter items
  var filterValue = $(this).children("a").attr('data-filter');
  $container.isotope({ filter: filterValue });

  // Change active links in navigation
  $(this).addClass("active").siblings("li").removeClass("active");

  return false;
});