import React from 'react';

function FormInput({ id, label, type = 'text', value, onChange, placeholder, required, loading, min, step, rows }) {
  return (
    <div className="col-md-6 mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="form-control"
          id={id}
          rows={rows || 3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={loading}
        ></textarea>
      ) : (
        <input
          type={type}
          className="form-control"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          step={step}
          disabled={loading}
        />
      )}
    </div>
  );
}

export default FormInput;
