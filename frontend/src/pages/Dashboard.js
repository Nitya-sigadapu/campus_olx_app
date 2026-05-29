import { useEffect, useState } from "react";
import axios from "axios";
import SellerProfileModal from "../components/SellerProfileModal";
import "../App.css";

const API = "";

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
        // console.log(err);
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
      // console.log(err);
    }


  };

  const showContact = async (id) => {

    try {

      const listing = listings.find(l => l.id === id);

      if (listing.seller_id === user.id) {
        alert("You cannot show interest in your own listing");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/interests`,
        {
          userId: user.id,
          listingId: id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const res = await axios.get(
        `${API}/api/listings/${id}/contact`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setContacts(prev => ({
        ...prev,
        [id]: res.data.contact
      }));

    } catch (err) {
      // console.log(err);
    }


  };

  return (
    <div className="space-y-8">

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-4">
        <input
          className="flex-1 min-w-[200px] border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Search books, electronics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="w-full md:w-32 border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="w-full md:w-32 border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="w-full md:w-32 border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Marketplace</h2>
        <p className="text-slate-500 mt-1">Discover items listed by students on campus.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {listings.map(item => (

          <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            {item.image_url ? (
              <img
                src={item.image_url.startsWith('http') ? item.image_url : `/uploads/${item.image_url.split('/').pop()}`}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                No Image Available
              </div>
            )}

            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 truncate pr-2">
                  {item.title}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  ₹{item.price}
                </span>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2 mb-3 flex-1">
                {item.description}
              </p>

              <div className="space-y-1 mb-4">
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Condition:</span>
                  <span className="font-semibold text-slate-700">{item.item_condition}</span>
                </p>
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Interested:</span>
                  <span className="font-semibold text-indigo-600">{item.interest_count || 0} students</span>
                </p>
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Seller:</span>
                  <span
                    className="font-semibold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedSeller({ id: item.seller_id, name: item.seller_name })}
                  >
                    {item.seller_name || "Unknown"}
                  </span>
                </p>
              </div>

              {contacts[item.id] && (
                <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 text-center font-medium">
                  Contact: {contacts[item.id]}
                </div>
              )}

              <div className="flex space-x-2 mt-auto">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm active:translate-y-1 active:scale-95 active:shadow-inner ${item.seller_id === user.id ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'}`}
                  onClick={() => showContact(item.id)}
                  disabled={item.seller_id === user.id}
                >
                  Interested
                </button>

                <button
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm active:translate-y-1 active:scale-95 active:shadow-inner ${item.seller_id !== user.id ? 'bg-gray-100 text-gray-400 cursor-not-allowed hidden' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300'}`}
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

      <div className="flex justify-center space-x-4 pt-6 pb-12">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 active:translate-y-1 active:scale-95 active:shadow-inner ${page === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 active:translate-y-1 active:scale-95 active:shadow-inner ${listings.length < 12 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
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
