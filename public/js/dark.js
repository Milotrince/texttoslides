let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let $button = $("#dark-toggle")
// TODO: use cookies instead of localstorage
let theme = localStorage.getItem("theme");

document.body.classList.toggle(theme+"-theme")
$button.text(theme)

$button.on("click", () => {
  theme = theme == "dark" ? "light" : "dark"
  $button.text(theme)
  
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
  
  localStorage.setItem("theme", theme);
});
