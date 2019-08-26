// When input change, the textarea can autoresize
// If the size reaches 150px, it stop growing.
$("#description_input").on("input", function(e) {
    $(this).css("height", "auto");
    var scrollHeight = $(this)[0].scrollHeight;
    $(this).css("overflow", "hidden");
    $(this).css("height", scrollHeight + "px")
});

$(function(){
    $(".twentytwenty-container").twentytwenty({default_offset_pct: 0.5, no_overlay: true});
});

var slider_view = true;
$("#change_view_btn").click(function(e){
    if (slider_view){
        $("#slider_view").addClass("d-none");
        $("#original_view").removeClass("d-none");
        slider_view = false;
    }
    else{
        $("#original_view").addClass("d-none");
        $("#slider_view").removeClass("d-none");
        slider_view = true;
    }
});


// login modal
$(".card a[href='/login']").on("click", function(e){
    var url = $(this).attr("href");
    if(window.location.pathname === "/login" || window.location.pathname === "/register"){
        //When use is on login or register page, ignore it.
        return;
    }
    e.preventDefault();
    login_register(url);
    window.history.pushState(null, null, url);
})


// Avoid submit form multiple times;
var newPostSubmitted = false;
$("#submitBtn").click(function(e){
    if(newPostSubmitted){
        e.preventDefault();
        return;
    }
    newPostSubmitted = true;
});