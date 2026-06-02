const mysql = require("mysql2/promise");

async function migrate() {
  console.log("Connecting to local database...");
  const localDb = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nitya3008",
    database: "campus_olx"
  });

  console.log("Connecting to TiDB Cloud...");
  const cloudDb = await mysql.createConnection({
    host: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
    user: "4DvQsEJ5rY6kwTY.root",
    password: "N35NmKYxaoX3cJQX", // <--- CHANGE THIS BEFORE RUNNING
    database: "campus_olx",
    ssl: { rejectUnauthorized: true }
  });

  const tables = ["users", "listings", "interests", "messages", "reviews"];

  const initQueries = [
    `CREATE TABLE IF NOT EXISTS users (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(100) DEFAULT NULL,
      email varchar(100) DEFAULT NULL,
      password varchar(255) DEFAULT NULL,
      otp varchar(10) DEFAULT NULL,
      verified tinyint(1) DEFAULT '0',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      contact varchar(15) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY email (email),
      UNIQUE KEY contact (contact)
    )`,
    `CREATE TABLE IF NOT EXISTS listings (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) DEFAULT NULL,
      description text,
      category varchar(100) DEFAULT NULL,
      item_condition varchar(100) DEFAULT NULL,
      price decimal(10,2) DEFAULT NULL,
      seller_id int NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      image_url varchar(255) DEFAULT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (seller_id) REFERENCES users (id)
    )`,
    `CREATE TABLE IF NOT EXISTS interests (
      id int NOT NULL AUTO_INCREMENT,
      user_id int DEFAULT NULL,
      listing_id int DEFAULT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_interest (user_id,listing_id)
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id int NOT NULL AUTO_INCREMENT,
      sender_id int NOT NULL,
      receiver_id int NOT NULL,
      message text NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id int NOT NULL AUTO_INCREMENT,
      reviewer_id int NOT NULL,
      seller_id int NOT NULL,
      rating int NOT NULL,
      review_text text,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_review (reviewer_id,seller_id)
    )`
  ];

  console.log("Creating tables in cloud if they do not exist...");
  for (const query of initQueries) {
    await cloudDb.query(query);
  }

  for (const table of tables) {
    console.log(`Migrating table: ${table}...`);
    const [rows] = await localDb.query(`SELECT * FROM ${table}`);
    if (rows.length === 0) {
      console.log(`Table ${table} is empty, skipping.`);
      continue;
    }

    // Get column names
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => "?").join(",");
    const insertQuery = `INSERT INTO ${table} (${columns.join(",")}) VALUES (${placeholders})`;

    let successCount = 0;
    for (const row of rows) {
      const values = columns.map(col => row[col]);
      try {
        await cloudDb.query(insertQuery, values);
        successCount++;
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting into ${table}:`, err.message);
        }
      }
    }
    console.log(`Successfully migrated ${successCount} rows into ${table}!`);
  }

  console.log("MIGRATION FULLY COMPLETE! ALL YOUR DATA IS NOW IN THE CLOUD!");
  process.exit(0);
}

migrate().catch(console.error);
