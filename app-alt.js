import { OAuth2Client } from "google-auth-library";
import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = "http://localhost:3000/callback";
const OAUTH2_SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

/* Creating an authorization code and then generateAuthUrl using it */
app.get("/login", (req, res) => {
  const authURL = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: OAUTH2_SCOPES,
  });
  res.redirect(authURL);
});

app.get("/callback", async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    console.log({ tokens });
  } catch (error) {
    console.log(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
