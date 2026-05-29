const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "nitya3008",
  database: process.env.DB_NAME || "campus_olx",
  port: process.env.DB_PORT || (process.env.DB_HOST ? 4000 : 3306)
};

// Enable SSL for cloud databases (like TiDB)
if (dbConfig.host !== "localhost") {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    // console.log("Database connection failed", err);
  } else {
    // console.log("MySQL Connected");
    
    // Automatically initialize tables if they don't exist
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

    initQueries.forEach(query => {
      db.query(query, (err) => {
        if (err) console.error("Error creating table:", err.message);
      });
    });
  }
});

module.exports = db;
