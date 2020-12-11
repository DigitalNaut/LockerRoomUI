import { useHistory } from "react-router-dom";
import * as Storage from "./storage";

export async function postData(url = "", token, data = {}) {
  console.log("Data:", data);

  try {
    const request = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
        token: token,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    if (request.response === 401) return clearCredentials();

    let response = await request.json();
    response.status = request.status;

    if (request.status !== 200) {
      console.log("Response status:", request.status, request.statusText);
    }

    return response;
  } catch (error) {
    console.log("Data POST failed: ", error);
    return error;
  }
}

export async function getData(url = "", token) {
  try {
    const request = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
        token: token,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });

    if (request.status === 401) return clearCredentials();
    if (request.status !== 200) {
      console.log("Response status:", request.status, request.statusText);
      return null;
    }

    let response = await request.json();
    response.status = request.status;

    return response;
  } catch (error) {
    throw error;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export async function login(credentials) {
  try {
    let response = await postData(
      "http://localhost:3000/auth/login",
      null,
      credentials
    );
    return response;
  } catch (error) {
    console.log("Login failed: ", error);
  }
}

export async function logout(token) {
  try {
    const response = await getData("http://localhost:3000/auth/logout", token);

    if (!response) {
      console.log("Service unavailable: Could not log out.");
      return false;
    }

    // console.log("Logout response:", response);

    if (response.status !== 200) {
      console.log("Error: Logout not confirmed by server.");
      return false;
    }

    return clearCredentials();
  } catch (error) {
    console.log("Failed to logout: ", error);
  }
}

export async function register(credentials, token = null) {
  try {
    const request = await postData(
      "http://localhost:3000/auth/register",
      token,
      credentials
    );

    return request;
  } catch (error) {
    console.log("Failed to logout: ", error);
  }
}

function clearCredentials() {
  try {
    localStorage.clear();
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.log("Error clearing credentials:", error);
  } finally {
    return false;
  }
}

export function saveCredentials(credentials) {
  try {
    if (!Storage.storageAvailable("localStorage"))
      console.log("Too bad, no localStorage for us...");
    else {
      localStorage.clear();
      localStorage.credentials = JSON.stringify(credentials);
      return localStorage.credentials;
    }

    if (!Storage.storageAvailable("sessionStorage"))
      console.log("Aww, no sessionStorage for us, either :(");
    else {
      sessionStorage.clear();
      sessionStorage.credentials = JSON.stringify(credentials);
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

    return credentials ? JSON.parse(credentials) : null;
  } catch (error) {
    console.log("Failed loading token:", error);
  }
}

export function loadSession() {
  let credentials = loadCredentials();

  if (!credentials) {
    console.log("Warning: Session not authenticated");
    return null;
  }

  let { username, token } = credentials || {};

  if (username && token) return credentials;

  console.log("Error: Invalid credentials");
  return null;
}
