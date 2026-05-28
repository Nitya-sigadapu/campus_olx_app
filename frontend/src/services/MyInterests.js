import { useEffect, useState } from "react";
import axios from "axios";

function MyInterests() {

  const [interests, setInterests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH INTERESTS
  const fetchInterests = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/interests/${user.id}`
      );

      setInterests(res.data);

    }
    catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    fetchInterests();
  }, []);


  // REMOVE INTEREST
  const removeInterest = async (listingId) => {

    try {

      await axios.delete(
        "http://localhost:5000/api/interests",
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
      console.log(err);
    }

  };




  return (

    <div className="page">

      <h2 className="page-title">Saved Items</h2>

      <div className="card-container">

        {interests.map(item => (

          <div key={item.id} className="card">

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
            <h3 className="item-title">{item.title}</h3>

            <p className="price">₹{item.price}</p>

            <p className="description" style={{fontSize: "0.9rem", color: "var(--text-main)", margin: "0 0 10px 0"}}>
              {item.description}
            </p>

            <p className="condition" style={{fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 10px 0"}}>
              Condition: <strong>{item.item_condition}</strong>
            </p>

              <p className="seller">Seller: {item.seller_name}</p>

              <p className="contact">Contact: <strong>{item.contact || "Not available"}</strong></p>

              <div className="card-actions">
                <button
                  className="btn-delete"
                  onClick={() => removeInterest(item.id)}
                >
                  Remove Interest
                </button>
              </div>
            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default MyInterests;