import React from 'react';

function ImageUpload({ imagePreview, setImagePreview, formData, setFormData, loading }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.onerror = () => {
        alert('Error reading image file');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="image" className="form-label">Item Image</label>
      <input
        type="file"
        className="form-control"
        id="image"
        onChange={handleImageUpload}
        accept="image/*"
        required
        disabled={loading}
      />
      {imagePreview && (
        <div className="mt-2">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="img-thumbnail"
            style={{ maxWidth: '800px' }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
