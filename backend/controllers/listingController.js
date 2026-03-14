const db = require("../config/db");


// CREATE LISTING

exports.createListing = (req, res) => {

 const { title, description, category, item_condition, price } = req.body || {};

 if(!title || !price){
  return res.status(400).json({message:"Title and price required"});
 }

 db.query(
  `INSERT INTO listings
  (title,description,category,item_condition,price,seller_id)
  VALUES (?,?,?,?,?,?)`,
  [title, description, category, item_condition, price, req.userId],
  (err,result)=>{

   if(err){
    console.log(err);
    return res.status(500).json(err);
   }

   res.json({message:"Listing created"});

  }
 );

};



// GET ALL LISTINGS (with search + filters + pagination)
exports.getListings = (req,res)=>{

 console.log("GET /api/listings called");

 const page = parseInt(req.query.page) || 1;
 const limit = 10;
 const offset = (page - 1) * limit;

 const search = req.query.search || "";
 const category = req.query.category || "";
 const minPrice = req.query.minPrice || 0;
 const maxPrice = req.query.maxPrice || 1000000;

 const query = `

    SELECT 
        listings.*,
        COUNT(interests.user_id) AS interest_count
    FROM listings
    LEFT JOIN interests
    ON listings.id = interests.listing_id
    WHERE listings.title LIKE ?
    AND listings.category LIKE ?
    AND listings.price BETWEEN ? AND ?
    GROUP BY listings.id
    LIMIT ? OFFSET ?
    `;

    db.query(
 query,
 [`%${search}%`, `%${category}%`, minPrice, maxPrice, limit, offset],
 (err,result)=>{

  if(err){
   console.log("Query error:",err);
   return res.status(500).json(err);
  }

  res.json(result);

 });

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
      console.log(err);
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
    "DELETE FROM listings WHERE id=?",
    [id],
    (err)=>{

     if(err){
      console.log(err);
      return res.status(500).json(err);
     }

     res.json({message:"Listing deleted"});

    }
   );

  }
 );

};

exports.showContact = (req,res)=>{

 console.log("Contact API called");

 const id = req.params.id;

 db.query(
  "SELECT contact FROM listings WHERE id=?",
  [id],
  (err,result)=>{

   if(err){
    console.log("DB error:",err);
    return res.status(500).json({error:"Database error"});
   }

   if(!result || result.length === 0){
    return res.status(404).json({message:"Listing not found"});
   }

   res.json({
    contact: result[0].contact
   });

  }
 );

};