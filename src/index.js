const CLASS_NAME_HIDDEN = "hidden_cont";

const LS_NAME = "name";
const LS_TODO = "todo";

const API_KEY = "70c04237da7d0635531ebbae07c46064";

const domYmd = document.querySelector("#ymd");
const domClock = document.querySelector("#clock");
const domNameForm = document.querySelector("#name_div form");
const domNameInput = document.querySelector("#name_input");
const domNameDisplay = document.querySelector("#name_display");
const domTodoForm = document.querySelector("#todo_div form");
const domTodoInput = document.querySelector("#todo_input");
const domTodoUl = document.querySelector("#todo_ul");
const domGeoWeather = document.querySelector("#geo_weather");

let todoList = [];
const imageList = [
  "https://hamonikr.org/files/attach/images/118/312/070/091a9004527320054613ddcdbda75b46.jpg",
  "http://photo.jtbc.joins.com/prog/drama/thepackage/Img/20171122_150638_0257.jpg",
  "https://img.theqoo.net/img/sGiXj.png",
  "https://miricanvas.zendesk.com/hc/article_attachments/900002314023/_________11_.png",
  "https://miricanvas.zendesk.com/hc/article_attachments/900002313983/_________9_.png"
];

function initTodoList() {
  const jsonStr = localStorage.getItem(LS_TODO);
  //console.log(jsonStr);

  if (!jsonStr | (jsonStr === "")) {
    return;
  }

  todoList = JSON.parse(jsonStr);

  for (let todoObj of todoList) {
    addTodoLi(todoObj);
  }
}

function handleDeleteTodo(event) {
  const todoId = event.target.parentNode.id;

  todoList = todoList.filter(function (data) {
    if (data.key === todoId) {
      return false;
    } else {
      return true;
    }
  });
  localStorage.setItem(LS_TODO, JSON.stringify(todoList));

  const domLi = document.querySelector(`#${todoId}`);
  domTodoUl.removeChild(domLi);
}

function addTodoLi(todoObj) {
  const liDom = document.createElement("li");
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "❌";
  deleteBtn.addEventListener("click", handleDeleteTodo);

  liDom.id = todoObj.key;
  liDom.innerText = todoObj.data;
  liDom.appendChild(deleteBtn);

  domTodoUl.appendChild(liDom);
}

function getTodoObj(todoStr) {
  return { key: `I${new Date().getTime()}`, data: todoStr };
}

function handleTodoSubmit(event) {
  event.preventDefault();

  const todoStr = domTodoInput.value;
  if (!todoStr | (todoStr === "")) {
    alert("TODO is empty!");
    return;
  }

  const todoObj = getTodoObj(todoStr);
  todoList.push(todoObj);
  localStorage.setItem(LS_TODO, JSON.stringify(todoList));

  addTodoLi(todoObj);
  domTodoInput.value = "";
}

function displayNameValue(userName) {
  domNameDisplay.innerText = `Welcome ${userName}!`;

  domNameForm.classList.add(CLASS_NAME_HIDDEN);
  domNameDisplay.classList.remove(CLASS_NAME_HIDDEN);
}

function handleNameSubmit(event) {
  event.preventDefault();

  const userName = domNameInput.value;
  if (!userName | (userName === "")) {
    alert("Name is empty!");
    return;
  }

  localStorage.setItem(LS_NAME, userName);

  displayNameValue(userName);
}

function initNameValue() {
  const userName = localStorage.getItem(LS_NAME);
  if (!userName | (userName === "")) {
    return;
  }

  displayNameValue(userName);
}

function convertPaddedNumStr(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

function getYmd(date) {
  const year = date.getFullYear();
  const month = convertPaddedNumStr(date.getMonth() + 1);
  const day = convertPaddedNumStr(date.getDate());

  return `${year}년 ${month}월 ${day}일`;
}

function getTime(date) {
  const hour = date.getHours();
  const isPm = hour / 12 >= 1;
  const hourBy12 = hour % 12 === 0 ? 12 : hour % 12;

  const hourStr = convertPaddedNumStr(hourBy12);
  const minuteStr = convertPaddedNumStr(date.getMinutes());
  const secondStr = convertPaddedNumStr(date.getSeconds());

  return `${isPm ? "PM" : "AM"} ${hourStr}:${minuteStr}:${secondStr}`;
}

function updateClock() {
  const curDate = new Date();

  domYmd.innerHTML = getYmd(curDate);
  domClock.innerHTML = getTime(curDate);
}

function successGetPosition(target) {
  const latitude = target.coords.latitude;
  const longitude = target.coords.longitude;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const temp = json.main.temp;
	  const name = json.name;
	  
	  domGeoWeather.innerText = `${temp}c / ${name}`;
    });
}

function errorGetPosition() {
  console.log("Getting location failed.");
}

function processLocWeather() {
  navigator.geolocation.getCurrentPosition(
    successGetPosition,
    errorGetPosition
  );
}

function applyRandomBg() {
  const randomNum = Math.floor(Math.random() * 5);

  const imageDom = document.querySelector("#backgroud_img");
  imageDom.src = imageList[randomNum];
}

function init() {
  applyRandomBg();
  processLocWeather();

  updateClock();
  setInterval(updateClock, 1000);

  initNameValue();
  domNameForm.addEventListener("submit", handleNameSubmit);

  initTodoList();
  domTodoForm.addEventListener("submit", handleTodoSubmit);
}

init();
