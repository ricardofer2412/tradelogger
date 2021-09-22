let darkMode = localStorage.getItem("darkMode");
var icon = document.getElementById("icon");
var logo = document.getElementById("logo");

const enableDarkMode = () => {
  document.body.classList.add("dark-theme");
  localStorage.setItem("darkMode", "enabled");
  icon.src = "/images/sun.png";
  logo.src = "/images/logo-light.png";
};
const disableDarkMode = () => {
  document.body.classList.remove("dark-theme");
  localStorage.setItem("darkMode", null);
  icon.src = "/images/moon.png";
  logo.src = "/images/logo.png";
};

if (darkMode === "enabled") {
  enableDarkMode();
}

icon.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

//   var icon = document.getElementById("icon");
//   var logo = document.getElementById("logo");
//   icon.onclick = function () {
//     document.body.classList.toggle("dark-theme");
//     if (document.body.classList.contains("dark-theme")) {
//       icon.src = "/images/sun.png";
//       logo.src = "/images/logo-light.png";
//     } else {
//
//     }
//   };
