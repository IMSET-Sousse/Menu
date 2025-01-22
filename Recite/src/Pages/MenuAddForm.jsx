import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FormInput from '../Comoenents/MenuForm/FormInput';
import ImageUpload from '../Comoenents/MenuForm/ImageUpload';
import FormSelect from '../Comoenents/MenuForm/FormSelect';

function MenuAddForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    prepTime: '',
    image: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/menu', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Menu item added successfully:', response.data);
      toast.success('Menu item added successfully!');  // Success toast

      // Clear the form after submission
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        prepTime: '',
        image: ''
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error adding menu item:', error);
      setError(error.response?.data?.error || 'Failed to add menu item. Please try again.');
      toast.error(error.response?.data?.error || 'Failed to add menu item. Please try again.'); // Error toast
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation button click
  const handleNavigate = () => {
    navigate('/table'); // Navigate to the homepage
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Menu Item</h2>

      {/* Remove AlertMessage components */}
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <FormInput
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter dish name"
            required
            loading={loading}
          />
          
          <FormInput
            id="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
            min="0"
            step="0.01"
            loading={loading}
          />
        </div>

        <ImageUpload 
          imagePreview={imagePreview} 
          setImagePreview={setImagePreview} 
          formData={formData}
          setFormData={setFormData}
          loading={loading}
        />

        <FormInput
          id="description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a short description of the dish"
          required
          loading={loading}
        />

        <FormSelect
          id="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          required
          options={['starter', 'main', 'dessert', 'beverage']}
          loading={loading}
        />

        <FormInput
          id="prepTime"
          label="Preparation Time (minutes)"
          type="number"
          value={formData.prepTime}
          onChange={handleChange}
          placeholder="Enter preparation time"
          required
          min="1"
          loading={loading}
        />

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Add Menu Item
          </button>
        </div>
      </form>

      {/* Navigation Button */}
      <div className="d-grid mt-3">
        <button className="btn btn-secondary" onClick={handleNavigate}>
          Go to TableMenu
        </button>
      </div>

    </div>
  );
}

export default MenuAddForm;
