function submit_comment(){
    var text = $("#comment_input").val();
    if (!(/\S/.test(text))){
        // found something other than a space or line break
        return;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: {comment: text},
        cache: false,
        success: function(data, status, xhr){
            if (data.redirect){
                window.location.replace(data.redirect)
            }
            else{
                $("#comment_input").val("");
                $("#comment_input").css("height", "auto")
                // successfully add comment
                var comment = ' \
                    <li class="media my-3"> \
                        <img class="avatar mr-3 rounded-circle" src="/stylesheets/avatar-placeholder.jpg"> \
                        <div class="media-body"> \
                          <h6 class="mt-0 mb-1">' + data.author.username + '</h6> \
                          <p>' + data.text + '</p> \
                        </div> \
                    </li>'
                $("#comment_list").prepend(comment);
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
        $(this).css('overflow', "auto");
        $(this).css("height", "120px");
    }
    else{
        $(this).css('overflow','hidden');
        $(this).css("height", scrollHeight + "px")
    }
});



