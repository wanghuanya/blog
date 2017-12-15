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
 * Homepage backstretch carousel
 */

$(function() {

  // Initialize Backstretch carousel

  var carousel = $(".home-carousel");
  var slide = $(".home-carousel__slide");

  carousel.backstretch([
      "assets/img/home_4.jpg",
      "assets/img/home_5.jpg"
  ], {duration: 5000, fade: 1000});


  // Set active indicator

  function activeIndicator() {
    var activeSlideIndex = slide.filter(".active").data("slide");

    $(".home-carousel__indicators > li")
      .removeClass("active")
      .filter("[data-slide-to='" + activeSlideIndex +"']").addClass("active");
  }
  activeIndicator();


  // Go to slide via controls and indicators

  $(".home-carousel__arrow").click(function() {
    ($(this).data("slide-to") == "prev") ? carousel.backstretch("prev") : carousel.backstretch("next");
  });
  $(".home-carousel__indicators > li").click(function() {
    var index = $(this).data("slide-to");

    carousel.backstretch("show", index);
  });


  // Switch slides on backstretch events

  carousel.on({
    "backstretch.before": function(e, instance, index) {

      // Remove animation classes to add it later (FF bug)
      slide.filter(".active").find("[data-animation]").each(function() {
        var animationClass = $(this).data("animation");
        $(this).removeClass("animated " + animationClass);
      })

      slide.filter(".active")
        .addClass("animated bounceOutLeft");
    },
    "backstretch.after": function(e, instance, index) {

      slide
        .removeClass("active animated bounceOutLeft")
        .filter("[data-slide='" + index + "']").addClass("active");

      // Add animation classes again (FF bug)
      slide.filter(".active").find("[data-animation]").each(function() {
        var animationClass = $(this).data("animation");
        $(this).addClass("animated " + animationClass);
      })

      activeIndicator();
    }
  });

});


/**
 * Coming soon background slideshow 
 */

$(".coming-soon").backstretch([
      "assets/img/coming-soon_1.jpg"
    , "assets/img/coming-soon_2.jpg"
    , "assets/img/coming-soon_3.jpg"
  ], {duration: 5000, fade: 750});