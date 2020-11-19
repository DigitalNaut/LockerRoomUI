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

export async function viewInbox(token) {
  try {
    let response = await getData(
      "http://localhost:3000/api/messages/all",
      token
    );

    return response;
  } catch (error) {
    console.log("Composing message failed:", error);
  }
}
