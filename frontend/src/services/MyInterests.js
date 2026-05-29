import { useEffect, useState } from "react";
import axios from "axios";

function MyInterests() {

  const [interests, setInterests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH INTERESTS
  const fetchInterests = async () => {

    try {

      const res = await axios.get(
        `/api/interests/${user.id}`
      );

      setInterests(res.data);

    }
    catch (err) {
      // console.log(err);
    }

  };

  useEffect(() => {
    fetchInterests();
  }, []);


  // REMOVE INTEREST
  const removeInterest = async (listingId) => {

    try {

      await axios.delete(
        "/api/interests",
        {
          data: {
            userId: user.id,
            listingId: listingId
          }
        }
      );

      fetchInterests();

    }
    catch (err) {
      // console.log(err);
    }

  };




  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Saved Items</h2>
        <p className="text-slate-500 mt-1">Items you have shown interest in.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {interests.map(item => (

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
                  <span>Seller:</span>
                  <span className="font-semibold text-slate-700">{item.seller_name}</span>
                </p>
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Contact:</span>
                  <span className="font-semibold text-indigo-600">{item.contact || "Not available"}</span>
                </p>
              </div>

              <div className="flex space-x-2 mt-auto">
                <button
                  className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm active:translate-y-1 active:scale-95 active:shadow-inner bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300"
                  onClick={() => removeInterest(item.id)}
                >
                  Remove Interest
                </button>
              </div>
            </div>

          </div>

        ))}

        {interests.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <p className="text-lg font-medium">No saved items yet.</p>
            <p className="text-sm mt-1 text-slate-400">Items you show interest in will appear here.</p>
          </div>
        )}

      </div>
    </div>
  );

}

export default MyInterests;