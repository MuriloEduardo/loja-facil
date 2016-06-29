//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

$('.ui.dropdown').dropdown();

// globally inherited on init
$.fn.dropdown.onChange = function(){
    alert('teste 1')
};

// during init
$('.ui.dropdown').dropdown({
 onChange: function() {
    alert('teste 2')
 }
});

// after init
$('.ui.dropdown').dropdown('setting', 'onChange', function(){
    alert('teste 3')
});