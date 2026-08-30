(function ($) {
  "use strict";
  var body = $("body");

  function imageCarousel() {
    $(".portfolio-page-carousel").each(function () {
      $(this).imagesLoaded(function () {
        $(".portfolio-page-carousel").owlCarousel({
          smartSpeed: 1200,
          items: 1,
          loop: true,
          dots: true,
          nav: true,
          navText: false,
          autoHeight: true,
          margin: 10,
        });
      });
    });
  }

  // Ajax Pages loader
  function ajaxLoader() {
    // Check for hash value in URL
    var ajaxLoadedContent = $("#page-ajax-loaded");

    function showContent() {
      ajaxLoadedContent.removeClass("fadeOutLeft closed");
      ajaxLoadedContent.show();
      $("body").addClass("ajax-page-visible");
    }

    function hideContent() {
      $("#page-ajax-loaded").addClass("fadeOutLeft closed");
      $("body").removeClass("ajax-page-visible");
      setTimeout(function () {
        $("#page-ajax-loaded.closed").html("");
        ajaxLoadedContent.hide();
      }, 500);
    }

    var href = $(".ajax-page-load").each(function () {
      href = $(this).attr("href");
      if (
        location.hash ==
        location.hash.split("/")[0] + "/" + href.substr(0, href.length - 5)
      ) {
        var toLoad = $(this).attr("href");
        showContent();
        ajaxLoadedContent.load(toLoad);
        return false;
      }
    });

    $(document)
      .on("click", "#ajax-page-close-button", function (e) {
        // Hide Ajax Loaded Page on Navigation cleck and Close button
        e.preventDefault();
        hideContent();
        location.hash = location.hash.split("/")[0];
      })
      .on("click", ".ajax-page-load", function () {
        // Show Ajax Loaded Page
        var hash =
          location.hash.split("/")[0] +
          "/" +
          $(this)
            .attr("href")
            .substr(0, $(this).attr("href").length - 5);
        location.hash = hash;
        showContent();

        return false;
      });
  }
  // /Ajax Pages loader

  // Animate layout
  function animateLayout() {
    var windowWidth = $(window).width(),
      animatedContainer = "",
      animateType = $("#page_container").attr("data-animation");

    if (windowWidth > 991) {
      animatedContainer = $(".page-container");
    } else {
      animatedContainer = $(".site-main");
    }

    animatedContainer.addClass("animated " + animateType);
    $(".page-scroll").addClass("add-prespective");
    animatedContainer.addClass("transform3d");
    setTimeout(function () {
      $(".page-scroll").removeClass("add-prespective");
      animatedContainer.removeClass("transform3d");
    }, 1000);
  }
  // /Animate layout

  function scrollTop() {
    if ($(body).scrollTop() > 150) {
      $(".lmpixels-scroll-to-top").removeClass("hidden-btn");
    } else {
      $(".lmpixels-scroll-to-top").addClass("hidden-btn");
    }
  }

  function skillsStyles() {
    var custom_styles = "";
    $(".skill-container").each(function () {
      var value = $(this).attr("data-value");

      if (value >= 101) {
        value = "100";
      }

      if (typeof value != "undefined") {
        var id = $(this).attr("id"),
          $custom_style =
            "#" + id + " .skill-percentage { width: " + value + "%; } ";
        custom_styles += $custom_style;
      }
    });
    $("head").append(
      '<style data-styles="leven-theme-skills-css" type="text/css">' +
        custom_styles +
        "</style>"
    );
  }

  //On Window load & Resize
  $(window)
    .on("load", function () {
      //Load
      // Animation on Page Loading
      $(".preloader").fadeOut(800, "linear");
      animateLayout();
    })
    .on("hashchange", function (event) {
      if (location.hash) {
        ajaxLoader();
      }
    });

  // On Document Load
  $(document).ready(function () {
    var movementStrength = 15;
    var height = movementStrength / $(document).height();
    var width = movementStrength / $(document).width();
    $("body")
      .on("mousemove", function (e) {
        var pageX = e.pageX - $(document).width() / 2,
          pageY = e.pageY - $(document).height() / 2,
          newvalueX = width * pageX * -1,
          newvalueY = height * pageY * -1;
        if ($(".page-container").hasClass("bg-move-effect")) {
          var elements = $(
            ".home-photo .hp-inner:not(.without-move), .lm-animated-bg"
          );
        } else {
          var elements = $(".home-photo .hp-inner:not(.without-move)");
        }
        elements.addClass("transition");
        elements.css({
          "background-position":
            "calc( 50% + " +
            newvalueX +
            "px ) calc( 50% + " +
            newvalueY +
            "px )",
        });

        setTimeout(function () {
          elements.removeClass("transition");
        }, 300);
      })
      .scroll(function () {
        scrollTop();
      });

    // Text rotation
    $(".text-rotation").owlCarousel({
      loop: true,
      dots: false,
      nav: false,
      margin: 10,
      items: 1,
      autoplay: true,
      autoplayHoverPause: false,
      autoplayTimeout: 3800,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
    });

    $("body").append(
      '<div id="page-ajax-loaded" class="page-portfolio-loaded animated fadeInLeft" style="display: none"><div class="preloader-portfolio"><div class="preloader-animation"><div class="preloader-spinner"></div></div></div></div>'
    );

    ajaxLoader();

    // Sidebar toggle
    $(".sidebar-toggle").on("click", function () {
      $("#blog-sidebar").toggleClass("open");
      $(this).toggleClass("open");
    });

    $(".lmpixels-scroll-to-top").click(function () {
      $("body,html").animate(
        {
          scrollTop: 0,
        },
        400
      );
      return false;
    });

    scrollTop();

    skillsStyles();
  });
})(jQuery);
