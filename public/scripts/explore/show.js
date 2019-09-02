function submit_comment(){
    if(newCommentSubmitted){
        return;
    }
    newCommentSubmitted = true;
    var text = $("#comment_input").val();
    if (!(/\S/.test(text))){
        // empty text
        newCommentSubmitted = false;
        return;
    }
    $("#comment_input").val("");
    $("#comment_input").css("height", "auto")
    $.ajax({
        type: "POST",
        url: url + "/comments",
        data: {comment: text},
        cache: false,
        success: function(data, status, xhr){
            newCommentSubmitted = false;
            if (data.redirect){
                window.location.replace(data.redirect)
            }
            else{
                // successfully add comment
                var comment = `
                    <li id="` + data._id + `" class="media my-3">
                        <a href="/users/` + data.author.id + `">
                            <img class="avatar-sm mt-1 mr-2 rounded-circle" src="` + data.author.avatar +`">
                        </a>
                        <div class="media-body">
                            <h6 class="m-0">
                                <a href="/users/` + data.author.id + `">
                                    ` + data.author.username + `
                                </a>
                            </h6>
                            <p class="mb-1 small text-secondary">
                                ` + data.date + `
                            </p>
                            <div class="row m-0">
                                <div class="col-11 p-0">
                                    <p class="text-break">` + data.text + `</p>
                                </div>
                                <div class="col-1 p-0">
                                    <a href="/explore/` + data.post_id + `/comments/` + data._id + `" class="deleteCommentBtn float-right">
                                        <i class="far fa-trash-alt text-danger"></i>
                                    </a>
                                </div>
                            </div>  
                        </div>
                    </li>`
                $("#comment_list").prepend(comment);
                // add delete listener
                $("#" + data._id + " .deleteCommentBtn").click(delete_comment);
                return false;
            } 
        }
    })
}

function delete_comment(e){
    e.preventDefault();
    if(deleteCommentSubmitted){
        return;
    }
    deleteCommentSubmitted = true;
    var delete_url = $(this).prop("href")
    var delete_tag = this;
    $.ajax({
        type: "DELETE",
        url: delete_url,
        success: function(data, status, xhr){
            deleteCommentSubmitted = false;
            if (data.redirect){
                window.location.replace(data.redirect)
                return;
            }
            $(delete_tag).closest("li").remove();
        }
    });

}



var url = window.location.href;
var newCommentSubmitted = false;
$("#comment_input").keydown(function(e){
    if (e.keyCode == 13 && !e.shiftKey) {
        submit_comment();
        return false;
    }
});

$("#comment_submit_btn").click(function(e){
    submit_comment();
});

var deleteCommentSubmitted = false;
$(".deleteCommentBtn").click(delete_comment);


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
        // don't show
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