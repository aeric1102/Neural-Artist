var contentImg = document.querySelector("#contentImg");
var ContentInput = document.querySelector("#selectContent");
var img_stylize_form = document.querySelector("#img_stylize_form");
var spinner = document.querySelector("#loading_spinner");
var submitBtn = document.querySelector("#submitBtn");


ContentInput.addEventListener("change", function(e){
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
        contentImg.src = e.target.result;
        contentImg.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
});

var styleInputs = document.querySelectorAll(".selectStyle");
styleInputs.forEach(function(input){
    var label = document.querySelector("label[for="+ input.id + "]");
    var img_path = "/data/styles/" + input.value + ".jpg"
    label.style.backgroundImage = "url(" + img_path + ")";
    label.style.backgroundSize= "cover";
})



spinner.style.display = "none";
img_stylize_form.addEventListener("submit", function(e){
    spinner.style.display = "";
    submitBtn.disabled = true;
});
