import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Building2, MapPin, User, Mail, Phone, Globe, Package, Star, DollarSign, FileText } from 'lucide-react';
import { createSupplier } from '../store/suppliersSlice';
import toast from 'react-hot-toast';
import './AddSupplierForm.css';

function AddSupplierForm({ onClose, columns }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    company: '',
    type: '',
    location: '',
    contact: '',
    email: '',
    phone: '',
    website: '',
    products: '',
    special: '',
    price: '',
    notes: '',
    status: 'todo'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company.trim()) {
      toast.error('Firmenname ist erforderlich');
      return;
    }

    try {
      await dispatch(createSupplier(formData)).unwrap();
      toast.success('Lieferant erfolgreich hinzugefügt');
      onClose();
    } catch (error) {
      toast.error('Fehler beim Hinzufügen des Lieferanten');
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <Plus className="header-icon" />
            Neuer Lieferant
          </h2>
          <button onClick={onClose} className="close-button" aria-label="Schließen">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="supplier-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="company">Firma *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="type">Typ</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="z.B. Hersteller, Händler"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="location">Standort</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="z.B. Deutschland, Berlin"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="contact">Kontaktperson</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="email">E-Mail</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="phone">Telefon</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="products">Produkte</label>
            <textarea
              id="products"
              name="products"
              value={formData.products}
              onChange={handleChange}
              rows="3"
              placeholder="Welche Produkte bietet der Lieferant an?"
            />
          </div>

          <div className="form-field">
            <label htmlFor="special">Besonderheiten</label>
            <textarea
              id="special"
              name="special"
              value={formData.special}
              onChange={handleChange}
              rows="3"
              placeholder="Was macht diesen Lieferanten besonders?"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="price">Preise</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Preisinformationen"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="notes">Notizen</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Zusätzliche Informationen"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Abbrechen
            </button>
            <button type="submit" className="btn-submit">
              Lieferant hinzufügen
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddSupplierForm;