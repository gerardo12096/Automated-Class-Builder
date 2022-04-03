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

/*
function allowDrop(event)
{
  event.preventDefault();
}

function drag(event)
{
  event.dataTransfer.setData("text", event.target.id)
}

*/
