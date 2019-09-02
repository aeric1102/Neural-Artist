var cropper = null
$("#contentImg").click(function() {
    $("#selectContent").trigger('click');
});
$("#selectContent").one(function(){
    // After choosing image, disable upload effect when clicking iamge.
    $("#contentImg").unbind("click");
});
$("#selectContent").change(function(){
    var file = $(this).prop("files")[0];
    loadImage(
        file,
        function(canvas) {
            $("#contentImg").prop("src", canvas.toDataURL("image/jpeg"));
            if(cropper){
                // when changing image, cropper needs to be destroyed, then recreated.
                cropper.destroy();
            }
            cropper = new Cropper(document.getElementById("contentImg"), {
                aspectRatio: 16 / 9,
                autoCropArea: 1.0,
                zoomable: false,
                movable: false,
                background:false 
            });
        },
        {orientation:true}
    );
});

$("#img_stylize_form").submit(function(e){
    e.preventDefault();
    $("#submitBtn").addClass("d-none");
    $("#loading_spinner").removeClass("d-none");

    cropper.getCroppedCanvas().toBlob(function(blob){
        var formData = new FormData();
        formData.append("selectContent", blob, $("#selectContent").prop("files")[0].name);
        formData.append("selectStyle", $(".selectStyle:checked").val());
        $.ajax({
            type: "POST",
            url: "/create",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data, status, xhr){
                window.location.href = data.redirect;
            },
            error(){
                window.location.href = "/create";
            }
        });
    }, "image/jpeg");
});

$("#top_jumbotron p").html("Create Your Artwork");


// document ready
$(function(){
    // scroll functions
    $(window).scroll(function(e) {
        $(".navbar")[$(window).scrollTop() >= 50 ? "addClass" : "removeClass"]("navbar-shrink");
        $("#brand-title")[$(window).scrollTop() >= 50 ? "addClass" : "removeClass"]("brand-invisible");
        $("#top_jumbotron")[$(window).scrollTop() >= 50 ? "addClass" : "removeClass"]("brand-invisible");
    });
});

if($(".selectStyle:checked").length > 0){
    //some style is selected through url query string
    $(".style-block").animate({
        scrollTop: $(".style-block-col").outerWidth()*Math.floor(parseInt($(".selectStyle:checked").val())/2)
        }, 500, function(){
    });
}
