var contentImg = document.querySelector("#contentImg");
var ContentInput = document.querySelector("#selectContent");
var styleImg = document.querySelector("#styleImg");
var styleInput = document.querySelector("#selectStyle");
var img_stylize_form = document.querySelector("#img_stylize_form");

ContentInput.addEventListener("change", function(e){
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
        contentImg.src = e.target.result;
        contentImg.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
});

styleImg.src = "./data/styles/" + styleInput.value + ".jpg";
styleInput.addEventListener("change", function(){
    styleImg.src = "./data/styles/" + styleInput.value + ".jpg";
});

var spinner = document.querySelector("#loading_spinner");
spinner.style.display = "none";
img_stylize_form.addEventListener("submit", function(e){
    spinner.style.display = "";
});
