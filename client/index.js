let baseURL = "https://yt-tool-extension-server.onrender.com/result/"; //Base url for get request to server
const cookiesTime = 60 * 60 * 24 * 30 * 3; //Approx three months (time in sec)
let mode = "light"; //Initailly set to light mode
init();

function getCookie() {
  chrome.cookies.get(
    {
      url: "https://youtube.com",
      name: "mode",
    },
    (cookie) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting cookie:", chrome.runtime.lastError);
        mode = "light";
      } else {
        if (cookie) mode = cookie.value;
        else mode = "light";
      }
      if (mode === "dark") addDarkClassToAllElements();
    }
  );
}

function setCookie(str) {
  chrome.cookies.set(
    {
      url: "https://youtube.com",
      name: "mode",
      value: str,
      expirationDate: new Date().getTime() / 1000 + cookiesTime,
      secure: true, // Set to true for HTTPS
      httpOnly: true, // Restrict access to JavaScript
    },
    (cookie) => {
      if (chrome.runtime.lastError)
        console.error("Error setting cookie:", chrome.runtime.lastError);
      else console.log("Cookie has been set:", cookie);
    }
  );
}

function addDarkClassToAllElements() {
  const elements = document.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) elements[i].classList.add("dark");
}

function removeDarkClassFromAllElements() {
  const elements = document.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++)
    elements[i].classList.remove("dark");
}

function toggleMode() {
  hide("content");
  if (mode === "light") {
    mode = "dark";
    setCookie("dark");
    addDarkClassToAllElements();
  } else {
    mode = "light";
    setCookie("light");
    removeDarkClassFromAllElements();
  }
  refresh();
}

function show(params) {
  document.getElementById(params).classList.remove("hidden");
  document.getElementById(params).classList.add("flex");
}

function hide(params) {
  document.getElementById(params).classList.remove("flex");
  document.getElementById(params).classList.add("hidden");
}

function process() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;
    let ans = isYtUrl(url);
    if (ans === true) calculateTime(url);
    else {
      document.getElementById("error_msg").innerHTML =
        "Not a YouTube page...!!";
      hide("loader");
      show("error");
    }
  });
}

function isYtUrl(inputString) {
  console.log(inputString);
  const regex = /^https?:\/\/(www\.|m\.)?youtube\.com/;
  let ans = regex.test(inputString);
  console.log("isYTURL", ans);
  return ans;
}

function getYTPlaylistID(playlistLink) {
  let regex = /(?:list=)([^&#]+)/;
  let match = playlistLink.match(regex);
  if (match && match[1]) return match[1];
  else throw new Error("Cannot find playlist ID !!");
}

function calculateTime(url) {
  let id = null;
  try {
    id = getYTPlaylistID(url);
  } catch {
    document.getElementById("error_msg").innerHTML =
      "Not a YouTube playlist page...<br>Please visit and try again !!";
    hide("loader");
    show("error");
    return;
  }
  getTime(id);
}

async function getTime(id) {
  let url, response;
  url = baseURL + id;
  try {
    response = await fetch(url);
    response = await response.json();
  } catch (error) {
    console.log(error);
    document.getElementById("error_msg").innerHTML =
      "Uhh... Something went wrong <br>Please try again later !!";
    hide("loader");
    show("error");
    return;
  }
  if (!response.ok) {
    document.getElementById("error_msg").innerHTML = response.message;
    hide("loader");
    show("error");
    return;
  }
  response = response.data;

  document.getElementById("count").innerHTML = response.count;
  document.getElementById("avgTime").innerHTML = response.avgTime;
  document.getElementById("t100x").innerHTML = response.t100x;
  document.getElementById("t125x").innerHTML = response.t125x;
  document.getElementById("t150x").innerHTML = response.t150x;
  document.getElementById("t175x").innerHTML = response.t175x;
  document.getElementById("t200x").innerHTML = response.t200x;

  hide("loader");
  show("content");
}

function refresh() {
  hide("content");
  show("loader");
  process();
}

async function init() {
  let element = document.getElementsByClassName("mode-btn");
  for (let i = 0; i < element.length; i++)
    element[i].addEventListener("click", toggleMode);

  element = document.getElementsByClassName("reload");
  for (let i = 0; i < element.length; i++)
    element[i].addEventListener("click", refresh);

  getCookie();
  refresh();
}
