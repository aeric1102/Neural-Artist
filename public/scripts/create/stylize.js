$("#selectContent").change(function(){
    var file = $(this).prop("files")[0];
    loadImage(
        file,
        function(canvas) {
            $("#contentImg").prop("src", canvas.toDataURL("image/jpeg"));
        },
        {orientation:true}
    );
});

$("#img_stylize_form").submit(function(){
    $("#submitBtn").addClass("d-none");
    $("#loading_spinner").removeClass("d-none");
});

$("#top_jumbotron p").html("Create Your Artwork");


// document ready
$(function(){
    // scroll functions
    $(window).scroll(function(e) {
        $(".navbar")[$(window).scrollTop() >= 100 ? "addClass" : "removeClass"]("navbar-shrink");
        $("#brand-title")[$(window).scrollTop() >= 100 ? "addClass" : "removeClass"]("brand-invisible");
        $("#top_jumbotron")[$(window).scrollTop() >= 100 ? "addClass" : "removeClass"]("brand-invisible");
    });
});

if($(".selectStyle:checked").length > 0){
    //some style is selected through url query string
    $(".style-block").animate({
        scrollTop: $(".style-block-col").outerWidth()*Math.floor(parseInt($(".selectStyle:checked").val())/2)
        }, 500, function(){
    });
}
