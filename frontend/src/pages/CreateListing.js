import { useState } from "react";
import axios from "axios";

function CreateListing() {

  const [form,setForm] = useState({
    title:"",
    description:"",
    category:"",
    item_condition:"",
    price:"",
   
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/listings/create",
        form,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      alert("Listing created!");
      window.location.reload();

    }catch(err){
      console.log(err);
      alert("Error creating listing");
    }

  };

  return(

    <div>

      <h2>Create Listing</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <br/><br/>

        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <br/><br/>

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
        />

        <br/><br/>

        <input
          name="item_condition"
          placeholder="Condition"
          onChange={handleChange}
        />

        <br/><br/>

        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
        />

        <br/><br/>

        <br/><br/>

        <button type="submit">
          Create Listing
        </button>

      </form>

    </div>

  );

}

export default CreateListing;