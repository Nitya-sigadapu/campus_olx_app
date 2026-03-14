import { useEffect, useState } from "react";
import axios from "axios";

import "../App.css";

function Dashboard() {

  const [listings, setListings] = useState([]);
  const [contacts, setContacts] = useState({});
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user")) || {};



  useEffect(() => {

    const fetchListings = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/listings?page=${page}&search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
        );

        setListings(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    fetchListings();

  }, [page, search, category, minPrice, maxPrice]);



  const deleteListing = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/listings/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setListings(prev => prev.filter(item => item.id !== id));

    } catch(err){
      console.log(err);
    }

  };



  const showContact = async (id) => {

    try{

      const listing = listings.find(l => l.id === id);

      if(listing.seller_id === user.id){
        alert("You cannot show interest in your own listing");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/interests",
        {
          userId:user.id,
          listingId:id
        }
      );

      const res = await axios.get(
        `http://localhost:5000/api/listings/${id}/contact`
      );

      setContacts(prev => ({
        ...prev,
        [id]:res.data.contact
      }));

    }catch(err){
      console.log(err);
    }

  };
  
  return(

    <div className="container">

      <input
        className="search-bar"
        placeholder="Search books, electronics..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />


      <div className="filters">

        <input
          placeholder="Category"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        />

        <input
          placeholder="Min Price"
          value={minPrice}
          onChange={(e)=>setMinPrice(e.target.value)}
        />

        <input
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e)=>setMaxPrice(e.target.value)}
        />

      </div>


      <h2>Marketplace</h2>


      <div className="listing-grid">

        {listings.map(item => (

          <div key={item.id} className="listing-card">

            <div className="listing-title">
              {item.title}
            </div>

            <div className="price">
              ₹{item.price}
            </div>

            <div className="interest-count">
              {item.interest_count || 0} students interested
            </div>


            <div className="button-group">

              <button
                onClick={()=>showContact(item.id)}
                disabled={item.seller_id === user.id}
              >
                Show Interest
              </button>


              <button
                onClick={()=>deleteListing(item.id)}
                disabled={item.seller_id !== user.id}
              >
                Delete
              </button>

            </div>


            {contacts[item.id] && (
              <p className="contact">
                Contact: {contacts[item.id]}
              </p>
            )}

          </div>

        ))}

      </div>


      <div className="pagination">

        <button
          onClick={()=>setPage(page-1)}
          disabled={page===1}
        >
          Previous
        </button>

        <button
          onClick={()=>setPage(page+1)}
          disabled={listings.length < 10}
        >
          Next
        </button>

      </div>


      {/* CHAT WINDOW */}

      

    </div>

  );

}

export default Dashboard;