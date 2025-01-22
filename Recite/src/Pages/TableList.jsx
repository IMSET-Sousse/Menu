import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import  './add.css'
function TableList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [categories, setCategories] = useState([]);

  const [updatedItem, setUpdatedItem] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    prepTime: '',
  });

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
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
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/menu/${itemId}`);
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Updated filter logic
  const filteredItems = menuItems.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(filters.name.toLowerCase());
    const categoryMatch = !filters.category || item.category === filters.category;
    const priceMatch = (!filters.minPrice || item.price >= Number(filters.minPrice)) &&
                      (!filters.maxPrice || item.price <= Number(filters.maxPrice));
    
    return nameMatch && categoryMatch && priceMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredItems.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-5 add">
      <h2 className="text-center mb-4">Menu Items</h2>
      <Link to="/add">
        <Button variant="success" className="mb-4">
          Add New Menu Item
        </Button>
      </Link>

      {/* Filters */}
      <div className="mb-4">
        <Form>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Search by Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Filter by name"
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Price Range (TND)</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    min="0"
                    className="w-50"
                  />
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    min="0"
                    className="w-50"
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        </Form>
      </div>

      {/* Rows per page selector */}
      <div className="mb-3">
        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0">Rows per page:</Form.Label>
          <Form.Select
            style={{ width: 'auto' }}
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Table */}
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
                <td>TND{Number(item.price).toFixed(2)}</td>
                <td>{item.prepTime} min</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleUpdate(item.id)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
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
            <li 
              key={number} 
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
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

      {/* Update Modal */}
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
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={updatedItem.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={updatedItem.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price (TND)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={updatedItem.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="prepTime">
                <Form.Label>Preparation Time (min)</Form.Label>
                <Form.Control
                  type="number"
                  name="prepTime"
                  value={updatedItem.prepTime}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default TableList;