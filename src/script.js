const taskLists = document.querySelectorAll(".task__list");

const urgentTasks = document.getElementById("urgentTasks");
const planTasks = document.getElementById("planTasks");
const inWorkTasks = document.getElementById("inWorkTasks");
const completeTasks = document.getElementById("completeTasks");

const addContainer = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const addBtns = document.querySelectorAll(".btn-add");
const saveBtns = document.querySelectorAll(".btn-save");

let updateLoaded = false;

let urgentListArray = [];
let planListArray = [];
let inWorkListArray = [];
let completeListArray = [];
let listArray = [];

addBtns.forEach((addBtn, index) => {
  addBtn.addEventListener("click", () => {
    addBtn.style.display = "none";
    addContainer[index].style.display = "flex";
  });
});

saveBtns.forEach((saveBtn, index) => {
  saveBtn.addEventListener("click", () => {
    if (addContainer[index].children[0].value) {
      listArray[index].push(addContainer[index].children[0].value);
      updateDOM();
      addContainer[index].children[0].value = "";
    }
    addContainer[index].style.display = "none";
    addBtns[index].style.display = "block";
  });
});

taskLists.forEach((taskList) => {
  taskList.addEventListener("click", (event) => {
    let targetElement = event.target;

    targetElement.setAttribute("contenteditable", "true");

    targetElement.addEventListener("blur", () => {
      targetElement.removeAttribute("contenteditable");
      let parentElem = targetElement.parentElement;

      let parentElemToArray = Array.from(parentElem.children);

      if (!targetElement.textContent && parentElem) {
        parentElem.removeChild(
          parentElem.children[parentElemToArray.indexOf(targetElement)]
        );
      }

      listArray[targetElement.dataset.number][
        parentElemToArray.indexOf(targetElement)
      ] = targetElement.textContent;

      updateDOM();
    });
  });
});

function getTaskBlocks() {
  if (
    localStorage.getItem("urgentItems") ||
    localStorage.getItem("planItems") ||
    localStorage.getItem("inWorkItems") ||
    localStorage.getItem("completeItems")
  ) {
    urgentListArray = JSON.parse(localStorage.urgentItems);
    planListArray = JSON.parse(localStorage.planItems);
    inWorkListArray = JSON.parse(localStorage.inWorkItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    urgentListArray = ["Отправить отчет", "Выполнить прототип"];
    planListArray = ["Разработать дизайн", "Изменить иконки"];
    inWorkListArray = [
      "Маркетинговый анализ",
      "Текстовый прототип",
      "Составить вопросы для заказчика",
    ];
    completeListArray = ["Подписать договор"];
  }
}

function updateTaskBlocks() {
  listArray = [
    urgentListArray,
    planListArray,
    inWorkListArray,
    completeListArray,
  ];
  const arrayNames = ["urgent", "plan", "inWork", "complete"];
  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArray[index]));
  });
}

function createElementTask(parentEl, content, blockNumber) {
  let elementTask = document.createElement("li");
  elementTask.classList.add("task__item");
  elementTask.setAttribute("draggable", "true");
  elementTask.setAttribute("ondragstart", "drag(event)");
  elementTask.setAttribute("data-number", blockNumber);
  elementTask.textContent = content;
  parentEl.append(elementTask);
}

let draggedTask;
let currentTaskBlock;

const colors = ["red", "blue", "orange", "green"];

function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  draggedTask = e.target;
}

function drop(e) {
  e.preventDefault();
  taskLists.forEach((task__inner, index) => {
    task__inner.classList.remove(`task__inner--${colors[index]}`);
  });
  let taskBlock = taskLists[currentTaskBlock];
  taskBlock.append(draggedTask);
  rebuildArrays();
}

function dragEnter(index) {
  taskLists[index].classList.add(`task__inner--${colors[index]}`);
  currentTaskBlock = index;
}
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== "");
  return filteredArray;
}

function updateDOM() {
  if (!updateLoaded) {
    getTaskBlocks();
  }
  urgentTasks.textContent = "";
  urgentListArray = filterArray(urgentListArray);
  urgentListArray.forEach((item) => {
    createElementTask(urgentTasks, item, 0);
  });

  planTasks.textContent = "";
  planListArray = filterArray(planListArray);
  planListArray.forEach((item) => {
    createElementTask(planTasks, item, 1);
  });

  inWorkTasks.textContent = "";
  inWorkListArray = filterArray(inWorkListArray);
  inWorkListArray.forEach((item) => {
    createElementTask(inWorkTasks, item, 2);
  });

  completeTasks.textContent = "";
  completeListArray = filterArray(completeListArray);
  completeListArray.forEach((item) => {
    createElementTask(completeTasks, item, 3);
  });

  updateLoaded = true;
  updateTaskBlocks();
}

function rebuildArrays() {
  urgentListArray = [];
  for (let i = 0; i < urgentTasks.children.length; i++) {
    urgentListArray.push(urgentTasks.children[i].textContent);
  }
  planListArray = [];
  for (let i = 0; i < planTasks.children.length; i++) {
    planListArray.push(planTasks.children[i].textContent);
  }
  inWorkListArray = [];
  for (let i = 0; i < inWorkTasks.children.length; i++) {
    inWorkListArray.push(inWorkTasks.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeTasks.children.length; i++) {
    completeListArray.push(completeTasks.children[i].textContent);
  }

  updateDOM();
}

updateDOM();
