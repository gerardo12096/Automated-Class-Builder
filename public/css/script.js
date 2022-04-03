let selection = document.getElementById("sYear");
let result = document.getElementById("pYear");
let submitBtn = document.getElementById("submitBtn");

const starter = document.getElementById("middle-start");

window.addEventListener("DOMContentLoaded", () => {
  showPlanner();
});

submitBtn.addEventListener("click", () => {
  result.innerHTML = "Spring: " + selection.value;
  console.log(result.innerHTML);
});

function showPlanner() {
  starter.innerHTML =
    "This is the middle column, Here lies where the actual class schedule building should take place.";
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
}

function closeFall() {
  document.getElementById("editFall").removeAttribute("hidden");
  document.getElementById("closeFall").setAttribute("hidden", true);
}
function editFall() {
  document.getElementById("editFall").setAttribute("hidden", true);
  document.getElementById("closeFall").removeAttribute("hidden");
}
function closeSpring() {
  document.getElementById("editSpring").removeAttribute("hidden");
  document.getElementById("closeSpring").setAttribute("hidden", true);
}
function editSpring() {
  document.getElementById("editSpring").setAttribute("hidden", true);
  document.getElementById("closeSpring").removeAttribute("hidden");
}
