import { postData, getData } from "./auth";

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
    let response = await getData(
      "http://localhost:3000/api/messages/all",
      token
    );

    let senders = {};

    for (const message of response)
      if (message.sender)
        if (!senders[message.sender]) senders[message.sender] = [message];
        else if (!contains(Object.values(senders[message.sender]), message))
          senders[message.sender].push(message);

    for (const messages of Object.values(senders))
      Object.values(messages).sort((a, b) => a.id - b.id);

    return senders;
  } catch (error) {
    console.log("Composing message failed:", error);
  }
}
