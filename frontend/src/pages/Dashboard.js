import { useEffect, useState } from "react";
import axios from "axios";
import SellerProfileModal from "../components/SellerProfileModal";
import "../App.css";

const API = "http://localhost:5000";

function Dashboard() {

  const [listings, setListings] = useState([]);
  const [contacts, setContacts] = useState({});
  const [selectedSeller, setSelectedSeller] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);


    return () => clearTimeout(timer);


  }, [search]);

  // FETCH LISTINGS
  useEffect(() => {


    const fetchListings = async () => {

      try {

        const res = await axios.get(
          `${API}/api/listings?page=${page}&search=${debouncedSearch}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
        );

        setListings(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    fetchListings();


  }, [page, debouncedSearch, category, minPrice, maxPrice]);

  const deleteListing = async (id) => {


    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `${API}/api/listings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setListings(prev => prev.filter(item => item.id !== id));

    } catch (err) {
      console.log(err);
    }


  };

  const showContact = async (id) => {

    try {

      const listing = listings.find(l => l.id === id);

      if (listing.seller_id === user.id) {
        alert("You cannot show interest in your own listing");
        return;
      }

      await axios.post(
        `${API}/api/interests`,
        {
          userId: user.id,
          listingId: id
        }
      );

      const res = await axios.get(
        `${API}/api/listings/${id}/contact`
      );

      setContacts(prev => ({
        ...prev,
        [id]: res.data.contact
      }));

    } catch (err) {
      console.log(err);
    }


  };

  return (
    <div className="dashboard-page">

      <div className="toolbar">
        <input
          className="search-bar"
          placeholder="Search books, electronics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="filter-input"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="filter-input"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="filter-input"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <h2 className="page-title">Marketplace</h2>

      <div className="listing-grid">

        {listings.map(item => (

          <div key={item.id} className="listing-card">

            {item.image_url ? (
              <img
                src={`http://localhost:5000${item.image_url}`}
                alt={item.title}
                className="card-image"
              />
            ) : (
              <div className="card-image-placeholder">
                No Image Available
              </div>
            )}

            <div className="card-content">
              <h3 className="listing-title">
                {item.title}
              </h3>

              <p className="price">
                ₹{item.price}
              </p>

              <p className="description" style={{fontSize: "0.9rem", color: "var(--text-main)", margin: "0 0 10px 0"}}>
                {item.description}
              </p>

              <p className="condition" style={{fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 10px 0"}}>
                Condition: <strong>{item.item_condition}</strong>
              </p>

              <p className="interest-count">
                {item.interest_count || 0} students interested
              </p>

              <p className="seller">
                Seller: <span
                  className="seller-link"
                  onClick={() => setSelectedSeller({ id: item.seller_id, name: item.seller_name })}
                >
                  {item.seller_name || "Unknown"}
                </span>
              </p>

              {contacts[item.id] && (
                <p className="contact">
                  Contact: <strong>{contacts[item.id]}</strong>
                </p>
              )}

              <div className="card-actions">
                <button
                  className="btn-interest"
                  onClick={() => showContact(item.id)}
                  disabled={item.seller_id === user.id}
                >
                  Interested
                </button>

                <button
                  className="btn-delete"
                  onClick={() => deleteListing(item.id)}
                  disabled={item.seller_id !== user.id}
                >
                  Delete
                </button>
              </div>
            </div>

          </div>

        ))}

      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={listings.length < 12}
        >
          Next Page
        </button>
      </div>

      {selectedSeller && (
        <SellerProfileModal
          sellerId={selectedSeller.id}
          sellerName={selectedSeller.name}
          currentUserId={user.id}
          onClose={() => setSelectedSeller(null)}
        />
      )}

    </div>
  );

}

export default Dashboard;
