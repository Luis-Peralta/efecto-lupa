/*!
 * Mobile plugin for jQuery Magnify (https://thdoan.github.io/magnify/)
 *
 * jQuery Magnify by T. H. Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at https://choosealicense.com/licenses/mit/
 */

(function ($) {
  // Ensure this is loaded after jquery.magnify.js

  if (!$.fn.magnify) return;
  // Add required CSS
  $('<style>' +
    '.lens-mobile {' +
    'position:fixed;' +
    'top:0;' +
    'left:0;' +
    'width:100%;' +
    'height:100%;' +
    'background:rgba(0,0,0,1);' +
    'display:none;' +
    'overflow:scroll;' +
    '-webkit-overflow-scrolling:touch;' +
    'z-index:9999;' +
    '}' +
    '.magnify-mobile>.close {' +
    'position:fixed;' +
    'top:50%;' +
    // 'right:45%;' +
    'width:32px;' +
    'height:32px;' +
    'background:rgba(51, 51, 51,0.5);' +
    'border-radius:16px;' +
    'color:#fff;' +
    'display:inline-block;' +
    'font:normal bold 20px/32px sans-serif;' +
    'letter-spacing:0;' +
    'opacity:0.8;' +
    'text-align:center;' +
    'text-shadow:none;' +
    'z-index:9999;' +
    '}' +
    '@media only screen and (min-device-width:320px) and (max-device-width:773px) {' +
    '/* Assume QHD (1440 x 2560) is highest mobile resolution */' +
    '.lens-mobile { display:block; }' +
    '}' +
    '.lens-mobile, img{' +
    'padding-top:20%;' +
    '}' +
    '</style>').appendTo('head');
  // Ensure .magnify is rendered
  $(window).on('load', function () {

    $('body').append('<div class="magnify-mobile"><div class="lens-mobile"></div></div>');
    var $lensMobile = $('.lens-mobile');
    // Only enable mobile zoom on smartphones
    if ($lensMobile.is(':visible') && !!('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch) || navigator.msMaxTouchPoints)) {
      var $magnify = $('.magnify'),
        $magnifyMobile = $('.magnify-mobile');
      // Disable desktop magnifying lens
      $magnify.off();
      // Initiate mobile zoom
      // NOTE: Fixed elements inside a scrolling div have issues in iOS, so we need to insert the
      // close icon at the same level as the lens.
      $magnifyMobile.hide().append('<i class="close">&times;</i>');

      // Hook up event handlers
      $magnifyMobile.children('.close').on($magnify.data('mobileCloseEvent'), function () {
        $magnifyMobile.toggle();
        $("#view-responsive").attr("content", "width=device-width, initial-scale=1.0 ,maximum-scale=1.0, user-scalable=0");
        $('<style>' +
          '.container-fluid {' +
          'filter:blur(0px) !important;' +
          '}' +
          '</style>').appendTo('head');
      });
      $magnify.children('img').on({
        'touchend': function () {
          // Only execute on tap
          if ($(this).data('drag')) return;
          var oScrollOffset = $(this).data('scrollOffset');
          $magnifyMobile.toggle();
          $('<style>' +
            '.container-fluid {' +
            'filter:blur(5px) !important;' +
            '}' +
            '</style>').appendTo('head');
          // Zoom into touch point')
          $lensMobile.scrollLeft(oScrollOffset.x);
          $lensMobile.scrollTop(oScrollOffset.y);
        },
        'touchmove': function () {
          // Set drag state
          $(this).data('drag', true);
        },
        'touchstart': function (e) {
          // Render zoom image
          // NOTE: In iOS background-image is url(...), not url("...").
          $lensMobile.html('<img src="' + $(this).prev('.magnify-lens').css('background-image').replace(/url\(["']?|["']?\)/g, '') + '" class="img-fluid">');
          // Determine zoom position
          var $magnifyImage = $(this),
            oZoomSize = $magnifyImage.data('zoomSize'),
            nX = e.originalEvent.touches[0].pageX - $magnifyImage.offset().left,
            nXPct = nX / $magnifyImage.width(),
            nY = e.originalEvent.touches[0].pageY - $magnifyImage.offset().top,
            nYPct = nY / $magnifyImage.height();
          // Store scroll offsets
          $magnifyImage.data('scrollOffset', {
            'x': (oZoomSize.width * nXPct) - (window.innerWidth / 2),
            'y': (oZoomSize.height * nYPct) - (window.innerHeight / 2)
          });

          // Reset drag state
          $(this).data('drag', false);

          $("#view-responsive").attr("content", "width=device-width, initial-scale=1.0, user-scalable=yes");
        }
      });
    }
  });
}(jQuery));
