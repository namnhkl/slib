$(document).ready(function () {
    $('.bannerAuto').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: true,
                loop: true
            }
        }
    });

    // Đặt chiều cao slider là 450px
    $('.owl-carousel .item-slide img').each(function () {
        $(this).css({
            'height': '500px',
            'object-fit': 'cover',
            'width': '100%'
        });
    });
});
// ==================================================

$(document).ready(function () {
    $('.classSlider').owlCarousel({
        loop: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2.2,
                nav: true,
                margin: 20,
            },
            600: {
                items: 4,
                nav: false
            },
            1000: {
                items: 6,
                nav: true,
                loop: true
            }
        }
    });
});


// ==========================================
// books 

$(document).ready(function () {
    $('.bookSlider').owlCarousel({
        loop: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2.2,
                margin:20,
                nav: true
            },
            600: {
                items: 4,
                nav: false
            },
            1000: {
                items: 6,
                nav: true,
                loop: true
            }
        }
    });
    $('.owl-carousel .item-books-1 img').each(function () {
        $(this).css({
            'height': '260px',
            'object-fit': 'cover',
            'width': '100%'
        });
    });
    $('.item-books-1 a > p').prepend('<span class="leftSide"></span>');
    $('.bookSlider .owl-nav').prepend('<span class="owl-title"><a href="#">Xem thêm</a></span>');
});

// ============================================

$(document).ready(function () {
    $('.bookSlider-review').owlCarousel({
        loop: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2.2,
                margin:20,
                nav: true
            },
            600: {
                items: 4,
                nav: false
            },
            1000: {
                items: 6,
                nav: true,
                loop: true
            }
        }
    });
    $('.owl-carousel .item-books-2 img').each(function () {
        $(this).css({
            'height': '280px',
            'object-fit': 'cover',
            'width': '100%'
        });
    });
    $('.item-books-2 a > p').prepend('<span class="leftSide"></span>');
    $('.bookSlider-review .owl-nav').prepend('<span class="owl-title"><a href="#">Xem thêm</a></span>');
});

// ===========================================

$(document).ready(function () {
    $('.audioBox').owlCarousel({
        loop: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2.2,
                margin:20,
                nav: true
            },
            600: {
                items: 4,
                nav: false
            },
            1000: {
                items: 6,
                nav: true,
                loop: true
            }
        }
    });
    $('.owl-carousel .item-books-3 img').each(function () {
        $(this).css({
            'height': '280px',
            'object-fit': 'cover',
            'width': '100%'
        });
    });
    $('.item-books-3 a > p').prepend('<span class="leftSide"></span>');
    $('.audioBox .owl-nav').prepend('<span class="owl-title"><a href="#">Xem thêm</a></span>');
});

// =============================================

$(document).ready(function () {
    $('.videosBox').owlCarousel({
        loop: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2.2,
                margin:20,
                nav: true
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
                nav: true,
                loop: true
            }
        }
    });
    $('.owl-carousel .item-books-4 img').each(function () {
        $(this).css({
            'height': '160px',
            'object-fit': 'cover',
            'width': '100%'
        });
    });

    $('.videosBox .owl-nav').prepend('<span class="owl-title"><a href="#">Xem thêm</a></span>');
});
