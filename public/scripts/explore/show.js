function submit_comment(){
    var text = $("#comment_input").val();
    if (!(/\S/.test(text))){
        // found something other than a space or line break
        return;
    }
    $("#comment_input").val("");
    $("#comment_input").css("height", "auto")
    $.ajax({
        type: "POST",
        url: url,
        data: {comment: text},
        cache: false,
        success: function(data, status, xhr){
            console.log("zz", data);
            if (data.redirect){
                window.location.replace(data.redirect)
            }
            else{
                $("#comment_input").val("");
                $("#comment_input").css("height", "auto")
                // successfully add comment
                var comment = `
                    <li class="media my-3">
                        <img class="avatar-sm mt-1 mr-2 rounded-circle" src="` + data.author.avatar + `">
                        <div class="media-body">
                            <h6 class="m-0">` + data.author.username + `</h6>
                            <p class="mb-1 small text-secondary">
                                ` + data.date + `
                            </p>
                          <p>` + data.text + `</p>
                        </div>
                    </li>`
                $("#comment_list").prepend(comment);
                return false;
            } 
        }
    })
}
var url = window.location.href;

$("#comment_input").keydown(function(event){
    if (event.keyCode == 13 && !event.shiftKey) {
        submit_comment();
        return false;
    }
});

$("#comment_submit_btn").click(function(event){
    submit_comment();
});

// When input change, the textarea can autoresize
// If the size reaches 150px, it stop growing.
$("#comment_input").on("input", function(e) {
    var text = $(this).val();
    if (/\S/.test(text)){
        // valid text
        $("#comment_submit_btn").removeAttr("disabled");
    }
    else{
        // empty text
        $("#comment_submit_btn").attr("disabled", true);
    }
    $(this).css("height", 0);
    var scrollHeight = $(this)[0].scrollHeight;
    if (scrollHeight > 120){
        $(this).css("overflow", "auto");
        $(this).css("height", "120px");
    }
    else{
        $(this).css("overflow", "hidden");
        $(this).css("height", scrollHeight + "px")
    }
});

$(function(){
    $(".twentytwenty-container").twentytwenty({default_offset_pct: 0.9, no_overlay: true});
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


$(".card a[href='/login']").click(function(e){
    if ($('.modal:visible').length > 0){
        //where there are some modals, 
        // don't shoe
        return;
    }
    var url = $(this).attr("href");
    if(window.location.pathname === "/login" || window.location.pathname === "/register"){
        //When use is on login or register page, ignore it.
        return;
    }
    e.preventDefault();
    login_register(url);
    window.history.pushState(null, null, url);
});