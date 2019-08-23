// document ready
$(function(){
    // scroll functions
    $(window).scroll(function(e) {
        $(".navbar")[$(window).scrollTop() >= 150 ? "addClass" : "removeClass"]("navbar-shrink");
        $("#brand-title")[$(window).scrollTop() >= 150 ? "addClass" : "removeClass"]("brand-invisible");
    });
});
