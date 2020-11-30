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

export async function viewEventsByUser() {
  try {
    let { token } = loadCredentials();

    let response = await getData("http://localhost:3000/api/events/my", token);

    if (!response) return console.log("Response was null");

    if (!response.length) Object.values(response).sort((a, b) => a.id - b.id);

    return response;
  } catch (error) {
    console.log("Error: Loading events failed:", error);
    throw error;
  }
}
