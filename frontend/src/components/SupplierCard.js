import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import {
  Edit3,
  Save,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Package,
  Star,
  DollarSign,
  FileText,
  GripVertical,
} from 'lucide-react';
import { updateSupplier, deleteSupplier, updateSupplierStatus, optimisticUpdate, fetchSuppliers } from '../store/suppliersSlice';
import toast from 'react-hot-toast';
import './SupplierCard.css';

function SupplierCard({ supplier, columns, suppliersByStatus, isDragging = false }) {
  const dispatch = useDispatch();
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const editRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: supplier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (editField && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editField]);

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value || '');
  };

  const handleSave = async () => {
    if (editValue !== supplier[editField]) {
      try {
        dispatch(optimisticUpdate({ id: supplier.id, data: { [editField]: editValue } }));
        await dispatch(updateSupplier({ id: supplier.id, data: { [editField]: editValue } })).unwrap();
        toast.success('Änderung gespeichert');
      } catch (error) {
        console.error('Save error:', error);
        toast.error('Fehler beim Speichern');
        // Revert optimistic update
        dispatch(fetchSuppliers());
      }
    }
    setEditField(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditField(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateSupplierStatus({ id: supplier.id, status: newStatus })).unwrap();
      toast.success('Status aktualisiert');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Möchten Sie diesen Lieferanten wirklich löschen?')) {
      try {
        await dispatch(deleteSupplier(supplier.id)).unwrap();
        toast.success('Lieferant gelöscht');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Fehler beim Löschen');
      }
    }
  };

  const handleMove = async (direction) => {
    const currentIndex = columns.findIndex(col => col.id === supplier.status);
    const suppliersInColumn = suppliersByStatus[supplier.status];
    const supplierIndex = suppliersInColumn.findIndex(s => s.id === supplier.id);

    try {
      switch (direction) {
        case 'up':
          if (supplierIndex > 0) {
            const newPosition = supplierIndex - 1;
            await dispatch(updateSupplier({ 
              id: supplier.id, 
              data: { position: newPosition } 
            })).unwrap();
            toast.success('Position geändert');
          }
          break;
        case 'down':
          if (supplierIndex < suppliersInColumn.length - 1) {
            const newPosition = supplierIndex + 1;
            await dispatch(updateSupplier({ 
              id: supplier.id, 
              data: { position: newPosition } 
            })).unwrap();
            toast.success('Position geändert');
          }
          break;
        case 'left':
          if (currentIndex > 0) {
            const newStatus = columns[currentIndex - 1].id;
            await dispatch(updateSupplierStatus({ id: supplier.id, status: newStatus })).unwrap();
            toast.success(`Zu "${columns[currentIndex - 1].name}" verschoben`);
          }
          break;
        case 'right':
          if (currentIndex < columns.length - 1) {
            const newStatus = columns[currentIndex + 1].id;
            await dispatch(updateSupplierStatus({ id: supplier.id, status: newStatus })).unwrap();
            toast.success(`Zu "${columns[currentIndex + 1].name}" verschoben`);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Move error:', error);
      toast.error('Fehler beim Verschieben');
    }
  };

  const renderField = (field, label, icon, isTextarea = false) => {
    const value = supplier[field] || '';
    const isEditing = editField === field;

    if (isEditing) {
      return (
        <div className="field-edit">
          {isTextarea ? (
            <textarea
              ref={editRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="edit-textarea"
              rows="3"
              aria-label={`${label} bearbeiten`}
            />
          ) : (
            <input
              ref={editRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="edit-input"
              aria-label={`${label} bearbeiten`}
            />
          )}
          <div className="field-actions">
            <button onClick={handleSave} className="btn-save" aria-label="Speichern">
              <Save size={16} />
            </button>
            <button onClick={handleCancel} className="btn-cancel" aria-label="Abbrechen">
              <X size={16} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="field-display" onClick={() => handleEdit(field, value)}>
        <div className="field-icon">{icon}</div>
        <div className="field-content">
          <span className="field-label">{label}</span>
          <span className="field-value">
            {value || <span className="placeholder">Klicken zum Hinzufügen</span>}
          </span>
        </div>
        <Edit3 size={14} className="edit-icon" />
      </div>
    );
  };

  if (isDragging) {
    return (
      <div className="supplier-card dragging">
        <div className="card-header">
          <h3>{supplier.company}</h3>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`supplier-card ${isSortableDragging ? 'sorting' : ''} ${isExpanded ? 'expanded' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      role="article"
      aria-label={`Lieferant: ${supplier.company}`}
    >
      <div className="card-drag-handle" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>

      <div className="card-header">
        <h3 onClick={() => handleEdit('company', supplier.company)}>
          {editField === 'company' ? (
            <input
              ref={editRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="edit-input company-edit"
              aria-label="Firmenname bearbeiten"
            />
          ) : (
            supplier.company
          )}
        </h3>
        <div className="card-actions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-expand"
            aria-label={isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, color: '#e53e3e' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="btn-delete"
            aria-label="Lieferant löschen"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      <div className="card-body">
        <div className="status-section">
          <label htmlFor={`status-${supplier.id}`}>Status:</label>
          <select 
            id={`status-${supplier.id}`}
            value={supplier.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select"
            aria-label="Status ändern"
          >
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
          <div className="nav-arrows" role="group" aria-label="Navigation">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove('up')}
              disabled={suppliersByStatus[supplier.status].findIndex(s => s.id === supplier.id) === 0}
              aria-label="Nach oben"
            >
              <ChevronUp size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove('down')}
              disabled={suppliersByStatus[supplier.status].findIndex(s => s.id === supplier.id) === suppliersByStatus[supplier.status].length - 1}
              aria-label="Nach unten"
            >
              <ChevronDown size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove('left')}
              disabled={columns.findIndex(col => col.id === supplier.status) === 0}
              aria-label="Nach links"
            >
              <ChevronLeft size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove('right')}
              disabled={columns.findIndex(col => col.id === supplier.status) === columns.length - 1}
              aria-label="Nach rechts"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>

        <div className="fields-grid">
          {renderField('type', 'Typ', <Package size={16} />)}
          {renderField('location', 'Standort', <MapPin size={16} />)}
          {renderField('contact', 'Kontaktperson', <User size={16} />)}
          {renderField('email', 'E-Mail', <Mail size={16} />)}
          {renderField('phone', 'Telefon', <Phone size={16} />)}
          {renderField('website', 'Website', <Globe size={16} />)}
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          className="expandable-section"
        >
          <div className="fields-expanded">
            {renderField('products', 'Produkte', <Package size={16} />, true)}
            {renderField('special', 'Besonderheiten', <Star size={16} />, true)}
            {renderField('price', 'Preise', <DollarSign size={16} />)}
            {renderField('notes', 'Notizen', <FileText size={16} />, true)}
          </div>
        </motion.div>

        <div className="card-footer">
          <span className="update-time">
            Aktualisiert: {new Date(supplier.updatedAt).toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SupplierCard;