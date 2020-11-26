import { postData, getData, loadCredentials } from "./auth";

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

function contains(arr, obj) {
  var i = arr.length;
  while (i--) if (arr[i].id === obj.id) return true;

  return false;
}

export async function viewInbox(token) {
  try {
    let { username } = loadCredentials();

    let response = await getData(
      "http://localhost:3000/api/messages/all",
      token
    );

    let correspondents = {};

    if (!response) return console.log("Response was null");

    for (const message of response)
      if (message.sender && message.recipient) {
        if (!correspondents[message.sender])
          correspondents[message.sender] = [];
        if (message.sender !== message.recipient)
          if (!correspondents[message.recipient])
            correspondents[message.recipient] = [];

        if (message.sender === username && message.recipient === username) {
          if (!contains(Object.values(correspondents[username]), message))
            correspondents[username].push(message);
        } else {
          if (
            message.sender !== username &&
            !contains(Object.values(correspondents[message.sender]), message)
          )
            correspondents[message.sender].push(message);
          else if (
            message.recipient !== username &&
            !contains(Object.values(correspondents[message.recipient]), message)
          )
            correspondents[message.recipient].push(message);
        }

        if (!correspondents[username].length) delete correspondents[username];
      }

    for (const messages of Object.values(correspondents))
      Object.values(messages).sort((a, b) => a.id - b.id);

    return correspondents;
  } catch (error) {
    console.log("Accessing inbox failed:", error);
  }
}
