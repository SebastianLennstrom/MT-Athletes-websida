const emailTo = "mtathletes@outlook.com"; 

document.getElementById("socials_icons--mail").addEventListener("click", function(e) {
    e.preventDefault();
    location.href = "mailto:" + emailTo + '?cc=' + "" + '&subject=' + "" + '&body=' + "";
});