var cur_url = window.location.href;

if (window.location.pathname === "/explore"){
    $("#top_jumbotron p").html("Find Some Ideas");
}

var mq = window.matchMedia("(max-width: 992px)");
if (!mq.matches) {
    // window width is greater than 992px
    $("#postModal").on("shown.bs.modal", function(){
        $.getScript("/scripts/explore/show.js");
        $(".card a[href='/login']").off("click");
    });
    $("#postModal").on("hidden.bs.modal", function(){
        $.getScript("/scripts/explore/show.js");
        if (window.location.href !== cur_url){
            history.back();
        }
        postLinkClicked = false;
    });
    window.onpopstate = function(e){
        $("#postModal").modal("hide");
        // redeclare because it covers the function in main.js 
        $("#loginRegisterModal").modal("hide");
    }  
    var postLinkClicked = false;
    $(".post-link").click(function(e){
        e.preventDefault();
        if (postLinkClicked){
            return;
        }
        postLinkClicked = true;
        var post_url = $(this).attr("href");
        $.get(post_url, function(data) {
            var html = $(data);
            var show_data = $(".container", html);
            var first_col = $("#main_col", html);
            first_col.removeClass("col-lg-8");
            $("#postModal .modal-body").html(show_data.html());
            $("#postModal").modal()
            $("#show_card").removeClass("border border-top-0 rounded-0").addClass("border-0");
            window.history.pushState(null, null, post_url);
        });
    });
}
