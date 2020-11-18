async function postData(url = "", token, data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
        token: token,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

        console.log("Fiing")

    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    console.log("Data post failed: ", error);
  }
}

async function getData(url = "", token) {
  try {
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
        token: token,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    console.log("Data post failed: ", error);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export async function sendMsg(token, sender, recipient, msg) {
  try {
    let response = await postData(
      "http://localhost:3000/api/messages/new",
      token,
      {
        sender: sender,
        recipient: recipient,
        subject: msg.subject,
        body: msg.body,
        footer: msg.footer,
      }
    );

    return response;
  } catch (error) {
    console.log("Composing message failed:", error);
  }
}

export async function viewInbox(token) {
  try {
    let response = await getData(
      "http://localhost:3000/api/messages/all",
      token
    );

    console.log("Response:", response);

    return response;
  } catch (error) {
    console.log("Composing message failed:", error);
  }
}
