import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast'; // Import toast
import { Link } from 'react-router-dom'; // Import Link for navigation

function TableList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [updatedItem, setUpdatedItem] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    prepTime: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page (5)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleUpdate = (itemId) => {
    const item = menuItems.find((item) => item.id === itemId);
    setCurrentItem(item);
    setUpdatedItem({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      prepTime: item.prepTime,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/menu/${currentItem.id}`,
        updatedItem
      );
      const updatedMenuItems = menuItems.map((item) =>
        item.id === currentItem.id ? { ...item, ...updatedItem } : item
      );
      setMenuItems(updatedMenuItems);
      setShowModal(false);
      toast.success(response.data.message); // Show success toast
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item'); // Show error toast
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/menu/${itemId}`);
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
      toast.success(response.data.message); // Show success toast
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item'); // Show error toast
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Update rows per page
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(menuItems.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Menu Items</h2>
      <Link to="/add">
        <Button variant="success" className="mb-4">
          Add New Menu Item
        </Button>
      </Link>

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

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Preparation Time</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-thumbnail"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{
                        width: '100px',
                        height: '100px',
                      }}
                    >
                      <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td className="text-capitalize">{item.category}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>{item.prepTime} min</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(item.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button
                className="page-link"
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal for updating menu item */}
      {currentItem && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Menu Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitUpdate}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={updatedItem.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={updatedItem.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={updatedItem.category}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={updatedItem.price}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="prepTime">
                <Form.Label>Preparation Time (min)</Form.Label>
                <Form.Control
                  type="number"
                  name="prepTime"
                  value={updatedItem.prepTime}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default TableList;
