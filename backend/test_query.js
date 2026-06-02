const mysql = require('mysql2/promise'); 
async function test() { 
  try { 
    const db = await mysql.createConnection({ 
      host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com', 
      user: '4DvQsEJ5rY6kwTY.root', 
      password: 'N35NmKYxaoX3cJQX', 
      database: 'campus_olx', 
      ssl: { rejectUnauthorized: false } 
    }); 
    const query = `SELECT listings.*, users.name AS seller_name, COUNT(interests.listing_id) AS interest_count FROM listings LEFT JOIN interests ON listings.id = interests.listing_id JOIN users ON listings.seller_id = users.id WHERE listings.title LIKE ? AND listings.category LIKE ? AND listings.price BETWEEN ? AND ? GROUP BY listings.id, users.name ORDER BY listings.created_at DESC LIMIT ? OFFSET ?`; 
    console.log('Executing query...'); 
    const [rows] = await db.query(query, ['%%', '%%', 0, 1000000, 12, 0]); 
    console.log('Rows:', rows.length); 
    process.exit(0); 
  } catch(e) { 
    console.error(e); 
    process.exit(1); 
  } 
} 
test();
