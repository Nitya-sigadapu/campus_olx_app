import { useEffect, useState } from "react";
import axios from "axios";

function MyInterests(){

  const [interests,setInterests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH INTERESTS
  const fetchInterests = async () => {

    try{

      const res = await axios.get(
        `http://localhost:5000/api/interests/${user.id}`
      );

      setInterests(res.data);

    }
    catch(err){
      console.log(err);
    }

  };

  useEffect(() => {
  fetchInterests();
}, []);


  // REMOVE INTEREST
  const removeInterest = async (listingId) => {

    try{

      await axios.delete(
        "http://localhost:5000/api/interests",
        {
          data:{
            userId:user.id,
            listingId:listingId
          }
        }
      );

      fetchInterests();

    }
    catch(err){
      console.log(err);
    }

  };




  return(

  <div className="page">

    <h2 className="page-title">My Interests</h2>

    <div className="card-container">

      {interests.map(item => (

        <div key={item.id} className="card">

          <h3 className="item-title">{item.title}</h3>

          <p className="price">₹{item.price}</p>

          <p className="seller">Seller Email: {item.seller_name}</p>

          <p className="contact">Contact: {item.contact || "Not available"}</p>

          <button 
            className="remove-btn"
            onClick={()=>removeInterest(item.id)}
          >
            Remove Interest
          </button>

        </div>

      ))}

    </div>

  </div>

);

}

export default MyInterests;