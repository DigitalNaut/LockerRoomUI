import { postData, getData, loadCredentials } from "./auth";

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export async function createEvent(event) {
  try {
    let { username, role, token } = loadCredentials();

    if (!username)
      throw new Error("Authentication Error: Not enough privileges to proceed");

    console.log("User role:", role);

    if (role !== "admin")
      return console.log("Permission Error: Event creation not allowed");

    console.log("Event to create:", event);

    let [
      title,
      about,
      type,
      code,
      userFilter,
      mandatory,
      expDate,
      template,
    ] = event;

    mandatory = mandatory ? 1 : 0;

    let response = await postData(
      "http://localhost:3000/api/events/new",
      token,
      {
        creator: username,
        title,
        about,
        type,
        code,
        userFilter,
        mandatory,
        expDate,
        template,
      }
    );

    return response;
  } catch (error) {
    console.log("Creating event failed:", error);
    throw error;
  }
}

function contains(arr, obj) {
  var i = arr.length;
  while (i--) if (arr[i].id === obj.id) return true;

  return false;
}

export async function viewEventsByType(type = "public") {
  try {
    let { token } = loadCredentials();

    let response = await getData(
      `http://localhost:3000/api/events/type/${type}`,
      token
    );

    if (!response) return console.log("Response was null");

    if (!response.length) Object.values(response).sort((a, b) => a.id - b.id);

    return response;
  } catch (error) {
    console.log("Error: Loading events failed:", error);
    throw error;
  }
}

export async function viewEventsByUser() {
  try {
    let { token, username } = loadCredentials();

    let response = await getData(
      `http://localhost:3000/api/events/by/${username}`,
      token
    );

    if (!response) return console.log("Response was null");

    if (!response.length) Object.values(response).sort((a, b) => a.id - b.id);

    return response;
  } catch (error) {
    console.log("Error: Loading events failed:", error);
    throw error;
  }
}

export async function viewEvent(title, code) {
  try {
    let { token } = loadCredentials();

    let response = await getData(
      `http://localhost:3000/api/events/title/${title}/code/${code}`,
      token
    );

    if (!response) return console.log("Response was null");

    return response;
  } catch (error) {
    console.log("Error: Could not fetch event:", error);
    throw error;
  }
}

export async function participateEvent(id, enclosure) {
  try {
    let { token } = loadCredentials();

    let response = await postData(
      `http://localhost:3000/api/petitions/new`,
      token,
      {
        event: id,
        enclosure: enclosure,
      }
    );

    if (!response) return console.log("Response was null");

    return response;
  } catch (error) {
    console.log("Error: Could not create petition for event event:", error);
    throw error;
  }
}

export async function getPetitionForEvent(eventId) {
  try {
    let { token, username } = loadCredentials();

    let response = await getData(
      `http://localhost:3000/api/petitions/event/${eventId}/sender/${username}`,
      token
    );

    if (!response) return console.log("Response was null");

    return response;
  } catch (error) {
    console.log("Error: Could not fetch petition for event:", error);
    throw error;
  }
}

export async function getAllPetitionForEvent(eventId) {
  try {
    let { token } = loadCredentials();

    let response = await getData(
      `http://localhost:3000/api/petitions/event/${eventId}`,
      token
    );

    if (!response) return console.log("Response was null");

    return response;
  } catch (error) {
    console.log("Error: Could not fetch petition for event:", error);
    throw error;
  }
}
