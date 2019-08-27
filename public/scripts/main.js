var cur_url = window.location.href;

// document ready
$(function(){
    // scroll functions
    $(window).scroll(function(e) {
        $(".navbar")[$(window).scrollTop() >= 150 ? "addClass" : "removeClass"]("navbar-shrink");
        $("#brand-title")[$(window).scrollTop() >= 150 ? "addClass" : "removeClass"]("brand-invisible");
        $("#top_jumbotron")[$(window).scrollTop() >= 150 ? "addClass" : "removeClass"]("brand-invisible");
    });
});

/////////////////////////////
// Login and Register Modal 
function login_register(url){
    $("#error_message").empty();
    $("input").val("")
    $.get(url, function(data){
        var html = $(data);
        var main_text = html.find("#main_text").text();
        var bottom_text = html.find("#bottom_text").text();
        var action_href = html.find("#submit_form").attr("action");
        html.find("a[href='javascript:history.back()']").remove();
        $("#bottom_div a:contains("+ bottom_text + ")").removeClass("d-none");
        $("#bottom_div a:contains("+ main_text + ")").addClass("d-none");
        $("#loginRegisterModalLabel").html(main_text);
        $("#loginRegisterModal form").attr("action", action_href);
        $("#loginRegisterModal .modal-body button").html(main_text);
        $("#loginRegisterModal").modal();
    });
}

// Login and register in navbar
$(".navbar a[href='/login'], \
   .navbar a[href='/register']").click(function(e){
    var url = $(this).attr("href");
    if(window.location.pathname === "/login" || window.location.pathname === "/register"){
        //When use is on login or register page, ignore it.
        return;
    }
    e.preventDefault();
    login_register(url);
    window.history.pushState(null, null, url);
})

// Login or register link on the bottom of modal
var process_bottom_link = false;
var new_url = null;
$("#loginRegisterModal a[href='/login'], \
   #loginRegisterModal a[href='/register']").click(function(e){
    var url = $(this).attr("href");
    if(url === cur_url){
        return;
    }
    e.preventDefault();
    process_bottom_link = true;
    new_url = url;
    $("#loginRegisterModal").modal("hide");
})


// window history part
window.onpopstate = function(e){
    $("#loginRegisterModal").modal("hide");
}

$("#loginRegisterModal").on("hidden.bs.modal", function(e){
    if(process_bottom_link){
        login_register(new_url);
        window.history.replaceState(null, null, new_url);
        process_bottom_link = false;
        new_url = null;
        return
    }
    if (window.location.href !== cur_url){
        history.back();
    }
});


//submit login or register form
var loginRegisterFormSubmitted = false;
$("#loginRegisterModal .modal-body button").click(function(e){
    //prevent submit form
    e.preventDefault();
    if(loginRegisterFormSubmitted){
        return;
    }
    loginRegisterFormSubmitted = true;
    $("#error_message").empty();
    $.ajax({
        type: "POST",
        url: $("#loginRegisterModal form").attr("action"),
        data: {
            username: $("input[name='username']").val(),
            password: $("input[name='password']").val()
        },
        cache: false,
        success: function(data, status, xhr){
            loginRegisterFormSubmitted = false
            var html = $(data);
            if (html.find("#header-alert").length) {
                $("#error_message").html(html.find("#header-alert"));
            }
            else{
                // success
                window.location.replace(cur_url);
            }
        }
    });

})
/////////////////////////////
