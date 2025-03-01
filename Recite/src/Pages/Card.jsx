import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Card() {
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to show 5 items per page

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Easing function
      once: true, // Trigger animation only once
    });

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

  // Pagination logic
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(menuItems.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="container mt-5">
      {/* Title */}
      <h2 className="text-center mb-4">Our Menu</h2>

      {/* Dropdown to select rows per page */}
      <div className="mb-3">
        <label>Rows per page:</label>
        <select
          className="form-select"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Card Grid */}
      <div className="row">
        {currentItems.map((item, index) => (
          <div
            className="col-md-4 mb-4"
            key={item.id}
            data-aos="fade-up" // Animation type
            data-aos-delay={index * 100} // Staggered delay
          >
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

      {/* Pagination Controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(number)}
                style={{
                  backgroundColor: currentPage === number ? 'green' : 'transparent',
                  color: currentPage === number ? 'white' : 'black',
                  borderColor: currentPage === number ? 'green' : '#dee2e6',
                }}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Card;
