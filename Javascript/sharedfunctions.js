const emailTo = "mtathletes@outlook.com"; // Replace with the desired email address

document.getElementById("socials_icons--mail").addEventListener("click", function(e) {
    e.preventDefault();
    location.href = "mailto:" + emailTo + '?cc=' + "" + '&subject=' + "" + '&body=' + "";
});