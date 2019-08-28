// Avoid submit form multiple times;
var savePostSubmitted = false;
$("#saveSubmitBtn").click(function(e){
    if(savePostSubmitted){
        e.preventDefault();
        return;
    }
    savePostSubmitted = true;
});

var deletePostSubmitted = false;
$("#deleteSubmitBtn").click(function(e){
    if(deletePostSubmitted){
        e.preventDefault();
        return;
    }
    deletePostSubmitted = true;
});