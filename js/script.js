document.addEventListener("DOMContentLoaded", function () {
    const currentLocation = window.location.pathname.split("/").pop(); // Get current page filename
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentLocation) {
            link.classList.add("active"); // Add active class to current page link
        }
    });
});

