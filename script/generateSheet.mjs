console.log("Generating...");
import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: "./script/credentials.json", // Ensure this path is correct
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"], // Ensure the scope is correct
});

async function getSheetContent() {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1pMLytf1vCt94CBvAQVZsNI4ynAwkyuzeBcy-lQrJiFs"; // Ensure this ID is correct
  const range = "Sheet1!B1:D1000"; // Replace with the range of cells you want to retrieve
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const en = {};
    const vi = {};
    response.data.values.map((row) => {
      en[(row[0] || "").trim()] = (row[1] || "").trim();
      vi[(row[0] || "").trim()] = (row[2] || "").trim();
    });
    fs.writeFileSync("./src/app/translations/en.json", `${JSON.stringify(en, null, 2)}`);
    fs.writeFileSync("./src/app/translations/vi.json", `${JSON.stringify(vi, null, 2)}`);
    console.log("Done");
  } catch (error) {
    console.error("Error fetching sheet content:", error);
  }
}

getSheetContent();