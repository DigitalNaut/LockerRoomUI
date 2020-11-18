import * as Storage from "./storage";

async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    console.log("Data post failed: ", error);
  }
}

async function getData(url = "") {
  try {
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    console.log("Data post failed: ", error);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export async function login(credentials) {
  try {
    let response = await postData(
      "http://localhost:3000/auth/login",
      credentials
    );
    return response;
  } catch (error) {
    console.log("Login failed: ", error);
  }
}

export async function logout() {
  try {
    console.log("Logging out.");
    let response = await getData("http://localhost:3000/auth/logout");

    if (!response) throw "Internal error: Response obj is null.";

    clearCredentials();

    return response;
  } catch (error) {
    console.log("Failed to logout: ", error);
  }
}

function clearCredentials() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.log("Error clearing credentials:", error);
  }
}

export function saveCredentials(credentials) {
  try {
    if (!Storage.storageAvailable("localStorage"))
      console.log("Too bad, no localStorage for us...");
    else {
      localStorage.clear();
      localStorage.credentials = JSON.stringify(credentials);
      console.log(
        "Local Creds saved:",
        localStorage.credentials,
        localStorage.credentials.username,
        localStorage.credentials.token
      );
      return localStorage.credentials;
    }

    if (!Storage.storageAvailable("sessionStorage"))
      console.log("Aww, no sessionStorage for us, either :(");
    else {
      sessionStorage.clear();
      sessionStorage.credentials = JSON.stringify(credentials);
      console.log(
        "Session Creds saved:",
        sessionStorage.credentials,
        sessionStorage.credentials.username,
        sessionStorage.credentials.token
      );
      return sessionStorage.credentials;
    }

    return null;
  } catch (error) {
    console.log("Failed saving credentials:", error);
  }
}

export function loadCredentials() {
  try {
    let credentials = null;

    if (!Storage.storageAvailable("sessionStorage")) return null;
    else credentials = sessionStorage.credentials;

    if (!Storage.storageAvailable("localStorage")) return null;
    else credentials = localStorage.credentials;

    if (!credentials) throw "Credentials are null.";

    return JSON.parse(credentials);
  } catch (error) {
    console.log("Failed loading token:", error);
  }
}
