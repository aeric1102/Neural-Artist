var url = window.location.href;
$(".comment").keypress(function(event){
    if (event.which == 13){
        var text = $(this).val();
        $(this).val("");
        $.ajax({
            type: "POST",
            url: url,
            data: {comment: text},
            cache: false,
            success: function(data, status, xhr){
                if (data.redirect){
                    console.log(data.redirect);
                    window.location.replace(data.redirect)
                }
                else{
                    // successfully add comment
                    var comment = ' \
                        <li class="media my-4"> \
                            <img class="mr-3" src="/stylesheets/avatar-placeholder.jpg"> \
                            <div class="media-body"> \
                              <h5 class="mt-0 mb-1">' + data.author.username + '</h5> \
                              <p> ' + data.text + '</p> \
                            </div> \
                        </li>'
                    $("#comment_list").prepend(comment);
                } 
            }
        })
    }

})
