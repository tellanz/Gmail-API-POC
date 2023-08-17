import express from "express";
import "dotenv/config";
import { google } from "googleapis";

const app = express();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function getUser(req, res) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const user = await gmail.users.getProfile({ userId: req.params.email });
    res.send(user.data);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
}

async function getMails(req, res) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const user = await gmail.users.messages.list({
      userId: req.params.email,
      maxResults: 10,
    });
    res.send(user.data);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/mail/user/:email", (req, res) => {
  getUser(req, res);
});

app.get("/mail/user/:email/mails", (req, res) => {
  getMails(req, res);
});
