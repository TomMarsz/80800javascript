//
const user = prompt("Insert a valid user name");
const todoInput = document.getElementById("todoInput");
const todoAddBtn = document.getElementById("todoAddBtn");
const todoListPendingTable = document.querySelector(".todo-list-pending-table");
const todoListCompletedTable = document.querySelector(".todo-list-completed-table");


let todoCurrentInput = "";
const todoTaskList = [];

todoInput.addEventListener("input", function (e) {
  todoCurrentInput = e.target.value;
  console.log(todoCurrentInput);
});

function clearTodoInput() {
  todoInput.value = "";
  todoCurrentInput = "";
}

function renderTodoList() {
  // To be implemented
}

function addTodoTask() {
  const trimmedTodo = todoCurrentInput.trim();
  if (trimmedTodo !== "") {
    todoTaskList.push(trimmedTodo);
    console.log("Task added:", trimmedTodo);
    console.log("Current task list:", todoTaskList);

    clearTodoInput();
  } else {
    alert("Please enter a valid task.");
  }
}

todoAddBtn.addEventListener("click", function () {
  addTodoTask();
});

function isValidUser(user) {
  const trimmed = user.trim();

  if (!isNaN(trimmed) && trimmed !== "") return false;

  const isAlphanumericOnly = /^[a-zA-Z0-9]+$/.test(trimmed);
  if (!isAlphanumericOnly) return false;

  return true;
}

if (!isValidUser(user)) {
  alert("Valid user name is required");
  throw new Error("Valid user name is required");
}

const h1 = document.querySelector("h1");
h1.innerText = `${user}'s TODO list`;
console.log(user);
