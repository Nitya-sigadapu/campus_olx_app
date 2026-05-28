import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function CreateListing() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    item_condition: "",
    price: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("item_condition", form.item_condition);
      formData.append("price", form.price);
      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        "http://localhost:5000/api/listings/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Listing created successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error creating listing");
    }
  };

  return (
    <div className="create-listing-page">
      <div className="form-card">
        <h2>Post a New Listing</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Item Title</label>
            <input
              className="form-input"
              name="title"
              placeholder="e.g. Scientific Calculator"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              name="description"
              placeholder="Briefly describe the item"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              name="category"
              placeholder="e.g. Electronics, Books"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Condition</label>
            <input
              className="form-input"
              name="item_condition"
              placeholder="e.g. Like New, Good, Fair"
              value={form.item_condition}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              className="form-input"
              type="number"
              name="price"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Item Photo</label>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
            Post Listing
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateListing;