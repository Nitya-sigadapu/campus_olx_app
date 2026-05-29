const db = require("../config/db");


// CREATE LISTING
exports.createListing = (req, res) => {
  // console.log("BODY:", req.body);
  // console.log("FILE:", req.file);

 const { title, description, category, item_condition, price } = req.body || {};

 if (!title || title.trim() === "") {
  return res.status(400).json({ message: "Title is required" });
 }
 if (price <= 0 || isNaN(price)) {
  return res.status(400).json({ message: "Price must be greater than zero" });
 }
 if (!description || description.trim().length < 12) {
  return res.status(400).json({ message: "Description must be at least 12 characters" });
 }
 if (!category || category.trim() === "") {
  return res.status(400).json({ message: "Category is required" });
 }

 const image_url = req.file ? req.file.path : null;

 db.query(
  `INSERT INTO listings
  (title,description,category,item_condition,price,seller_id,image_url)
  VALUES (?,?,?,?,?,?,?)`,
  [title, description, category, item_condition, price, req.userId, image_url],
  (err,result)=>{

   if(err){
    // console.log(err);
    return res.status(500).json(err);
   }

   res.json({message:"Listing created"});

  }
 );

};



// GET ALL LISTINGS (with search + filters + pagination)
exports.getListings = (req,res)=>{

 // console.log("GET /api/listings called");

 const page = parseInt(req.query.page) || 1;
 const limit = 12;
 const offset = (page - 1) * limit;

 const search = req.query.search || "";
 const category = req.query.category || "";
 const minPrice = req.query.minPrice || 0;
 const maxPrice = req.query.maxPrice || 1000000;

 const query = `
    SELECT 
        listings.*,
        users.name AS seller_name,
        COUNT(interests.listing_id) AS interest_count
    FROM listings
    LEFT JOIN interests ON listings.id = interests.listing_id
    JOIN users ON listings.seller_id = users.id
    WHERE listings.title LIKE ?
    AND listings.category LIKE ?
    AND listings.price BETWEEN ? AND ?
    GROUP BY listings.id
    ORDER BY listings.created_at DESC
    LIMIT ? OFFSET ?
    `;

 db.query(
  query,
  [`%${search}%`, `%${category}%`, minPrice, maxPrice, limit, offset],
  (err,result)=>{

   if(err){
    // console.log("Query error:",err);
    return res.status(500).json(err);
   }

   res.json(result);

  }
 );

};



// UPDATE LISTING (OWNER ONLY)
exports.updateListing = (req,res)=>{

 const id = req.params.id;

 const {title,description,category,item_condition,price} = req.body || {};

 db.query(
  "SELECT * FROM listings WHERE id=?",
  [id],
  (err,result)=>{

   if(err) return res.status(500).json(err);

   const listing = result[0];

   if(!listing){
    return res.status(404).json({message:"Listing not found"});
   }

   if(listing.seller_id !== req.userId){
    return res.status(403).json({message:"Forbidden"});
   }

   db.query(
    `UPDATE listings
     SET title=?,description=?,category=?,item_condition=?,price=?
     WHERE id=?`,
    [title,description,category,item_condition,price,id],
    (err)=>{

     if(err){
      // console.log(err);
      return res.status(500).json(err);
     }

     res.json({message:"Listing updated"});

    }
   );

  }
 );

};


// DELETE LISTING (OWNER ONLY)
exports.deleteListing = (req,res)=>{

 const id = req.params.id;

 db.query(
  "SELECT * FROM listings WHERE id=?",
  [id],
  (err,result)=>{

   if(err) return res.status(500).json(err);

   const listing = result[0];

   if(!listing){
    return res.status(404).json({message:"Listing not found"});
   }

   if(listing.seller_id !== req.userId){
    return res.status(403).json({message:"Forbidden"});
   }

   db.query(
    "DELETE FROM interests WHERE listing_id=?",
    [id],
    (err)=>{

     if(err){
      // console.log("Error deleting interests:", err);
      return res.status(500).json(err);
     }

     db.query(
      "DELETE FROM listings WHERE id=?",
      [id],
      (err)=>{

       if(err){
        // console.log("Error deleting listing:", err);
        return res.status(500).json(err);
       }

       res.json({message:"Listing deleted"});

      }
     );

    }
   );

  }
 );

};



// SHOW CONTACT (SECURE)
exports.showContact = (req, res) => {
  // console.log("Contact API called by user:", req.userId);

  const listingId = req.params.id;
  const requesterId = req.userId;

  if (!requesterId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  // Check if the requester is the seller OR has shown interest
  const query = `
    SELECT u.contact, l.seller_id 
    FROM listings l
    JOIN users u ON l.seller_id = u.id
    WHERE l.id = ?
  `;

  db.query(query, [listingId], (err, results) => {
    if (err) {
      // console.log("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const { contact, seller_id } = results[0];

    // If requester is the seller, they can see their own contact
    if (seller_id === requesterId) {
      return res.json({ contact: contact || "Not provided" });
    }

    // Otherwise, check if they are in the interests table
    db.query(
      "SELECT * FROM interests WHERE user_id = ? AND listing_id = ?",
      [requesterId, listingId],
      (err, interestResults) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (!interestResults || interestResults.length === 0) {
          return res.status(403).json({ message: "Forbidden. You must show interest first to view contact details." });
        }

        // Access granted
        res.json({ contact: contact || "Not provided" });
      }
    );
  });
};