import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Card() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch menu items from the API
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="container mt-5">
      {/* Title */}
      <h2 className="text-center mb-4">Our Menu</h2>
      
      <div className="row">
        {menuItems.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card menu-card">
              {item.image && (
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> ${item.price}
                </p>
                <p className="card-text">
                  <strong>Prep Time:</strong> {item.prepTime} minutes
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .menu-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .menu-card:hover {
          transform: translateY(-10px); /* Slightly lift the card */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add a subtle shadow */
        }
      `}</style>
    </div>
  );
}

export default Card;
