(function ($) {
    var $pswp = $('.pswp')[0];
    var image = [];

    console.log(image);

    $('.swiper-container').each(function () {
        var $pic = $(this),
            getItems = function () {
                var items = [];
                $pic.find('img').each(function () {
                    var $href = $(this).attr('src'),
                        $size = $(this).data('size').split('x'),
                        
                        // $width = $size[0],
                        // $height = $size[1];
                        //esto nos da el tamaño real de cada imagen:
                        $width = this.naturalWidth,
                        $height = this.naturalHeight;
                
                    var item = {
                        src: $href,
                        w: $width,
                        h: $height
                    }

                    items.push(item);
                });
                return items;
            }

        var items = getItems();


        $.each(items, function (index, value) {
            image[index] = new Image();
            image[index].src = value['src'];
        });


        $pic.on('click', 'figure', function (event) {
            event.preventDefault();

            //para obtener el valor del id del que esta activo
            var indice = parseInt($('.swiper-slide-active').attr("id"));
            var $index = indice
            console.log($index)

            var options = {
                index: $index,
                bgOpacity: 0.7,
                showHideOpacity: true
            }

            var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
            lightBox.init();
        });

    });
})(jQuery);
