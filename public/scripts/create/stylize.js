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

$(".selectStyle").each(function(){
    var img_path = "/data/styles/" + $(this).prop("value") + ".jpg";
    $("label[for="+ $(this).prop("id") + "]").css(
        {
            "backgroundImage": "url(" + img_path + ")",
            "backgroundSize": "cover"
        })
});

$("#img_stylize_form").submit(function(){
    $("#submitBtn").addClass("d-none");
    $("#loading_spinner").removeClass("d-none");
});

$("#top_jumbotron p").html("Create Your Artwork");