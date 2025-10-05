import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ""
    )}`,
    universe_domain: "googleapis.com",
  },
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const sheets = google.sheets({ version: "v4", auth });

export const getMusic = async () => {
  try {
    const spreadsheetId = "1mK1JyVHB3CrigDKTuMzsfREQbEYK5Rf9g5slyBlaIto";
    const range = "Music!A:G"; // Include all columns: Song Name, Artist, Album, Genre, Lyrics & Chords, URL, Notes
    console.log("Attempting to fetch music from Google Sheets...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    console.log("Successfully fetched data from Google Sheets");
    // Ensure we always return an array, even if no data
    return response.data.values || []; // Returns array of rows
  } catch (error) {
    console.error("Error in getMusic:", error);

    // Fallback data for testing when Google Sheets is not accessible
    if (
      error.message.includes("permission") ||
      error.message.includes("Unable to parse range") ||
      error.message.includes("not found")
    ) {
      console.log("Using fallback data due to Google Sheets access error");
      return [
        [
          "Song Name",
          "Artist",
          "Album",
          "Genre",
          "Lyrics & Chords",
          "URL",
          "Notes",
        ],
        [
          "Amazing Grace",
          "John Newton",
          "Hymns",
          "Gospel",
          "Amazing Grace, how sweet the sound...",
          "https://example.com",
          "Traditional hymn",
        ],
        [
          "How Great Thou Art",
          "Carl Boberg",
          "Classic Hymns",
          "Gospel",
          "O Lord my God, when I in awesome wonder...",
          "https://example.com",
          "Swedish hymn",
        ],
      ];
    }

    throw new Error(`Failed to fetch music: ${error.message}`);
  }
};

export const addMusic = async (row) => {
  try {
    const spreadsheetId = "1mK1JyVHB3CrigDKTuMzsfREQbEYK5Rf9g5slyBlaIto";
    const range = "Music!A:G"; // Include all columns
    console.log("Attempting to add music to Google Sheets:", row);
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values: [row] },
    });
    console.log("Successfully added music to Google Sheets");
  } catch (error) {
    console.error("Error in addMusic:", error);
    throw new Error(`Failed to add music: ${error.message}`);
  }
};

export const updateMusic = async (rowIndex, row) => {
  try {
    const spreadsheetId = "1mK1JyVHB3CrigDKTuMzsfREQbEYK5Rf9g5slyBlaIto";
    const range = `Music!A${rowIndex + 1}:G${rowIndex + 1}`; // Include all columns
    console.log("Attempting to update music in Google Sheets:", {
      rowIndex,
      row,
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values: [row] },
    });
    console.log("Successfully updated music in Google Sheets");
  } catch (error) {
    console.error("Error in updateMusic:", error);
    throw new Error(`Failed to update music: ${error.message}`);
  }
};

export const deleteMusic = async (rowIndex) => {
  try {
    // Google Sheets API doesn't directly delete rows via `values` API
    // You need to use `spreadsheets.batchUpdate` with `deleteDimension`
    const spreadsheetId = "1mK1JyVHB3CrigDKTuMzsfREQbEYK5Rf9g5slyBlaIto";
    console.log("Attempting to delete music from Google Sheets:", rowIndex);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
    console.log("Successfully deleted music from Google Sheets");
  } catch (error) {
    console.error("Error in deleteMusic:", error);
    throw new Error(`Failed to delete music: ${error.message}`);
  }
};
