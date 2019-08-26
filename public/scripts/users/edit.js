$("#uploadAvatar").change(function(){
    console.log("hi");
    var file = $(this).prop("files")[0];
    // var reader = new FileReader();
    // reader.onload = function(e){
    //     $("#avatarImg").prop("src", e.target.result);
    // };
    // reader.readAsDataURL(file);

    loadImage(
        e.target.files[0],
        function(img) {
            document.body.appendChild(img);
        },
        // { maxWidth: 600 } // Options
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
