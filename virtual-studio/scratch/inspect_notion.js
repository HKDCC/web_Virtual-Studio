const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function inspect() {
  const booksDb = process.env.NOTION_BOOKS_DB_ID;
  const notesDb = process.env.NOTION_NOTES_DB_ID;

  console.log("Books DB:", booksDb);
  console.log("Notes DB:", notesDb);

  if (booksDb) {
    try {
      const response = await notion.databases.retrieve({ database_id: booksDb });
      console.log("Books DB Properties:", Object.keys(response.properties));
    } catch (e) {
      console.error("Error retrieving Books DB:", e.message);
    }
  }

  if (notesDb) {
    try {
      const response = await notion.databases.retrieve({ database_id: notesDb });
      console.log("Notes DB Properties:", Object.keys(response.properties));
    } catch (e) {
      console.error("Error retrieving Notes DB:", e.message);
    }
  }
}

inspect();
