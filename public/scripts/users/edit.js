$("#uploadAvatar").change(function(){
    var file = $(this).prop("files")[0];
    loadImage(
        file,
        function(canvas) {
            $("#avatarImg").prop("src", canvas.toDataURL("image/jpeg"));
        },
        {orientation:true}
    );
})


// Avoid submit form multiple times;
var profileEditSubmitted = false;
$("#submitBtn").click(function(e){
    if(profileEditSubmitted){
        e.preventDefault();
        return;
    }
    profileEditSubmitted = true;
});
