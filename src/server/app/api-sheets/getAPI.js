import fse from "fs-extra";
import { google } from "googleapis";
import path from "path";
import readline from "readline";
import settings from "server/settings";

const root = settings.SERVER_ROOT_DIR;
const CRED_PATH = path.resolve(root, "data", "credentials.json");
const TOKEN_PATH = path.resolve(root, "data", "token.json");
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
];

const getCode = async url => {
  console.log("Authorize this app by visiting this url:", url);
  const promise = new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      resolve(code);
    });
  });
  const result = await promise;

  return result;
};

const generateToken = async oAuth2Client => {
  const access_type = "offline";
  const scope = SCOPES;
  const url = oAuth2Client.generateAuthUrl({ access_type, scope });
  const code = await getCode(url);
  const { tokens } = await oAuth2Client.getToken(code);

  await fse.writeFile(TOKEN_PATH, JSON.stringify(tokens));

  return tokens;
};

export default async () => {
  let sheets, drive;

  try {
    const cExists = await fse.pathExists(CRED_PATH);
    if (!cExists) {
      throw new Error(`fatal, no credentials in ${CRED_PATH}`);
    }
    const credentials = JSON.parse(await fse.readFile(CRED_PATH));
    const { client_id, client_secret, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const tExists = await fse.pathExists(TOKEN_PATH);
    const token = !tExists
      ? await generateToken(oAuth2Client)
      : JSON.parse(await fse.readFile(TOKEN_PATH));

    oAuth2Client.setCredentials(token);

    sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    drive = google.drive({ version: "v3", auth: oAuth2Client });
  } catch (error) {
    console.log(error);
    throw error;
  }

  return { sheets, drive };
};
