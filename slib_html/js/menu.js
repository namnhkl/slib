 // Get elements
const navbarToggle = document.getElementById("navbarToggle");
const navbarNav = document.getElementById("navbarNav");
const menuOverlay = document.getElementById("menuOverlay");

// Open menu function
function openMenu() {
  navbarNav.style.display = "block"; // Show menu
  setTimeout(() => {
    navbarNav.classList.add("show"); // Add sliding animation
    menuOverlay.classList.add("active"); // Show overlay
  }, 10);
}

// Close menu function
function closeMenu() {
  navbarNav.classList.remove("show"); // Remove sliding animation
  menuOverlay.classList.remove("active"); // Hide overlay
  setTimeout(() => {
    navbarNav.style.display = "none"; // Hide menu
  }, 300); // Match transition duration
}

// Toggle menu on click
navbarToggle.addEventListener("click", () => {
  if (navbarNav.classList.contains("show")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close menu when clicking on overlay
menuOverlay.addEventListener("click", closeMenu);


// ==============================


