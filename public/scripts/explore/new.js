// When input change, the textarea can autoresize
// If the size reaches 150px, it stop growing.
$("#description_input").on("input", function(e) {
    $(this).css("height", "auto");
    var scrollHeight = $(this)[0].scrollHeight;
    $(this).css('overflow','hidden');
    $(this).css("height", scrollHeight + "px")
});



