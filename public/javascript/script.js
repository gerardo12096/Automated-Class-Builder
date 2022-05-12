let selection = document.getElementById("sYear");
let result = document.getElementById("pYear");
let submitBtn = document.getElementById("submitBtn");
const editingFall = document.getElementById("editFall");
const editingSpring = document.getElementById("editSpring");
let nextBtn = document.querySelector(".next-btn");
let prevBtn = document.querySelector(".prev-btn");
const draggable = document.getElementById("draggable-list");
const starter = document.getElementById("middle-start");
let table2 = document.getElementById("table2");

//runs on page load
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fallTable1").classList.remove("connectedSortable");
  document.getElementById("springTable1").classList.remove("connectedSortable");
  document.getElementById("recommendedList").classList.remove("connectedSortable");
  document.getElementById("requiredList").classList.remove("connectedSortable");
  showPlanner();
  result.innerHTML = "Spring: " + (year + 4);
});

$(document).ready(function () {
  $("tbody.connectedSortable").sortable({
    connectWith: ".connectedSortable",
    helper: "clone",
    cursor: "move",
    zIndex: 99999,
    receive: function (event, ui) {
      /* here you can access the dragged row via ui.item
         ui.item has been removed from the other table, and added to "this" table
      */
      var addedTo = $(this).closest("table.mytable"),
        removedFrom = $("table.mytable").not(addedTo);
      //  alert(
      // "The ajax should be called for adding to " +
      //   addedTo.attr("id") +
      //  " and removing from " +
      //  removedFrom.attr("id")
      // );
    },
  });
});

var arr = [];

function dropHandler(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  ev.target.appendChild(table2.data);
  ev.currentTarget.style.background = "black";
  classes.push(data);
  console.log(classes);
}

let counter = 0;
let year = 2020;
let rows = table2.getElementsByTagName("tr");

submitBtn.addEventListener("click", () => {
  var getCurrentYear = selection.value;
  year = parseInt(getCurrentYear);
  result.innerHTML = "Spring: " + (year + 4);
  showPlanner();
});

function showPlanner() {
  //starter.innerHTML = "This is the middle column, Here lies where the actual class schedule building should take place.";
  editingFall.innerHTML = "Edit Fall " + (year + counter) + " Semester";
  editingSpring.innerHTML = "Edit Spring " + (year + counter + 1) + " Semester";
}

nextBtn.addEventListener("click", function () {
  if (counter >= 3) {
    showPlanner();
  } else {
    counter++;
    console.log("next button clicked" + counter)
    changeYear();
    showPlanner();
  }
});

prevBtn.addEventListener("click", () => {
  if (counter <= 0) {
    showPlanner();
  } else {
    counter--;
    console.log("prev button clicked" + counter)
    changeYear();
    showPlanner();
  }
});

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

//buttons will remove/add the "connectedSortable" classes, allowing items to be draggable.
function closeFall() {
  document.getElementById("editFall").removeAttribute("hidden");
  document.getElementById("closeFall").setAttribute("hidden", true);
  document.getElementById("fallTable1").classList.remove("connectedSortable");
  document
    .getElementById("recommendedList")
    .classList.remove("connectedSortable");
  document.getElementById("requiredList").classList.remove("connectedSortable");
}
function editFall() {
  document.getElementById("editFall").setAttribute("hidden", true);
  document.getElementById("closeFall").removeAttribute("hidden");
  document.getElementById("fallTable1").classList.add("connectedSortable");
  document.getElementById("recommendedList").classList.add("connectedSortable");
  document.getElementById("requiredList").classList.add("connectedSortable");
}
function closeSpring() {
  document.getElementById("editSpring").removeAttribute("hidden");
  document.getElementById("closeSpring").setAttribute("hidden", true);
  document.getElementById("springTable1").classList.remove("connectedSortable");
  document.getElementById("recommendedList").classList.remove("connectedSortable");
  document.getElementById("requiredList").classList.remove("connectedSortable");
}
function editSpring() {
  document.getElementById("editSpring").setAttribute("hidden", true);
  document.getElementById("closeSpring").removeAttribute("hidden");
  document.getElementById("springTable1").classList.add("connectedSortable");
  document.getElementById("recommendedList").classList.add("connectedSortable");
  document.getElementById("requiredList").classList.remove("connectedSortable");
}

function changeYear() {
  if ((counter == 0)) {
    document.getElementById("fallTable1").removeAttribute("hidden");
    document.getElementById("fallTable2").setAttribute("hidden", true);
    document.getElementById("fallTable3").setAttribute("hidden", true);
    document.getElementById("fallTable4").setAttribute("hidden", true);
    document.getElementById("springTable1").removeAttribute("hidden");
    document.getElementById("springTable2").setAttribute("hidden", true);
    document.getElementById("springTable3").setAttribute("hidden", true);
    document.getElementById("springTable4").setAttribute("hidden", true);
  }
  if ((counter == 1)) {
    document.getElementById("fallTable1").setAttribute("hidden", true);
    document.getElementById("fallTable2").removeAttribute("hidden");
    document.getElementById("fallTable3").setAttribute("hidden", true);
    document.getElementById("fallTable4").setAttribute("hidden", true);
    document.getElementById("springTable1").setAttribute("hidden", true);
    document.getElementById("springTable2").removeAttribute("hidden");
    document.getElementById("springTable3").setAttribute("hidden", true);
    document.getElementById("springTable4").setAttribute("hidden", true);
  }
  if ((counter == 2)) {
    document.getElementById("fallTable1").setAttribute("hidden", true);
    document.getElementById("fallTable2").setAttribute("hidden", true);
    document.getElementById("fallTable3").removeAttribute("hidden");
    document.getElementById("fallTable4").setAttribute("hidden", true);
    document.getElementById("springTable1").setAttribute("hidden", true);
    document.getElementById("springTable2").setAttribute("hidden", true);
    document.getElementById("springTable3").removeAttribute("hidden");
    document.getElementById("springTable4").setAttribute("hidden", true);
  }
  if ((counter == 3)) {
    document.getElementById("fallTable1").setAttribute("hidden", true);
    document.getElementById("fallTable2").setAttribute("hidden", true);
    document.getElementById("fallTable3").setAttribute("hidden", true);
    document.getElementById("fallTable4").removeAttribute("hidden");
    document.getElementById("springTable1").setAttribute("hidden", true);
    document.getElementById("springTable2").setAttribute("hidden", true);
    document.getElementById("springTable3").setAttribute("hidden", true);
    document.getElementById("springTable4").removeAttribute("hidden");
  }
}
