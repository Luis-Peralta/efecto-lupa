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
    'top:80%;' +
    // 'right:45%;' +
    'width:50px;' +
    'height:32px;' +
    //'background:rgba(51, 51, 51,0);' +
    'border-radius:16px;' +
    'color:#fff;' +
    'display:inline-block;' +
    'font:normal bold 20px/32px sans-serif;' +
    'letter-spacing:0;' +
    'opacity:1;' +
    'display: flex;' +
    'align-items: center;' +
    'text-align:center;' +
    'text-shadow:none;' +
    'z-index:9999;' +
    '}' +
    '@media only screen and (min-device-width:320px) and (max-device-width:773px) {' +
    '/* Assume QHD (1440 x 2560) is highest mobile resolution */' +
    '.lens-mobile { display:block;visibility:visible;transition:1s; }' +
    '.magnify-mobile { visibility:visible !important; transition:1s !important; }'+
    '}' +
    '.lens-mobile, img{' +
    'padding-top:15%;' +
    'display: flex;' +
    'align-items: center;' +
    '}' +
    '</style>').appendTo('head');
  // Ensure .magnify is rendered
  $(window).on('load', function () {

    $('body').append('<div class="magnify-mobile" style="visibility:hidden;"><div class="lens-mobile">' +
      '<div class="swiper-container swiper-mobile">' +
      '<div class="swiper-wrapper" id="swiper-Mobile"></div>' +
      '<div class="swiper-button-next"></div>' +
      '<div class="swiper-button-prev"></div>' +
      '</div>' +
      '</div></div>');
    var $swiperMobile = $('#swiper-Mobile');

    const listImage = $('.zoom');
    for (let i = 0; i < listImage.length; i++) {
      $swiperMobile.append('<div class="swiper-slide"><p class="px-2" style="color:white;padding-top:4%;position:absolute;">'+(i+1)+' / '+listImage.length +'</p><img src="' + listImage.eq(i).attr("src") + '" class="img-fluid" /></div>');
      console.log("/" + i.length);
    }

    // SLIDER PARA EL CAROUSEL DEL MODAL
    const swiper2 = new Swiper('.swiper-mobile', {
      // Optional parameters
      //loop: true,
      // If we need pagination
      // pagination: {
      //   el: '.swiper-pagination',
      // },
      spaceBetween: 35,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
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
      $magnifyMobile.hide().append('<i class="close"><img src="/src/row-left.png" class="img-fluid px-2"/></i>');

      // Hook up event handlers
      $magnifyMobile.children('.close').on($magnify.data('mobileCloseEvent'), function () {
        $magnifyMobile.toggle();
        $(".view-responsive").attr("content", "width=device-width, initial-scale=1.0 ,maximum-scale=1.0, user-scalable=no");
        $('<style>' +
          '.container-fluid {' +
          'filter:blur(0px) !important;' +
          'position:relative;' +
          '}' +
          ':root {' +
          'touch-action: pan-x pan-y;' +
          'height: 100%' +
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
            'position:fixed;' +
            '}' +
            ':root {' +
            'touch-action: auto;' +
            '}' +
            '</style>').appendTo('head');
          $(".view-responsive").attr("content", "width=device-width, initial-scale=1.0, user-scalable=yes");
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

          // const listImage = $('.zoom');
          // for (let i = 0; i < listImage.length ; i++){
          //   $swiperMobile.append('<div class="swiper-slide2"><img src="' + listImage.eq(i) + '" class="img-fluid"/></div>');
          //   console.log(listImage.eq(i));
          // }

          //$swiperMobile.html('<img src="' + $(this).prev('.magnify-lens').css('background-image').replace(/url\(["']?|["']?\)/g, '') + '" class="img-fluid">');
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
        }
      });
    }
  });
}(jQuery));
