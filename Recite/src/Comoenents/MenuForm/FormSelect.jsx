import React from 'react';

function FormSelect({ id, label, value, onChange, required, options, loading }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <select
        className="form-select"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={loading}
      >
        <option value="">Select a category</option>
        {options.map(option => (
          <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;
