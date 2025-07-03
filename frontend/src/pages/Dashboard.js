import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  LayoutDashboard,
  Plus,
  Download,
  LogOut,
  Search,
  Filter,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { fetchSuppliers, fetchColumns, updateSupplierStatus, optimisticUpdate } from '../store/suppliersSlice';
import { logout } from '../store/authSlice';
import SupplierCard from '../components/SupplierCard';
import AddSupplierForm from '../components/AddSupplierForm';
import Statistics from '../components/Statistics';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const { suppliers, columns, isLoading } = useSelector((state) => state.suppliers);
  const { user } = useSelector((state) => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchColumns());
  }, [dispatch]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const activeSupplier = suppliers.find(s => s.id === activeId);
    if (!activeSupplier) return;

    // Check if dropped on a column or in a column content area
    let targetColumnId = overId;
    
    // If dropped on a column header or content, find the column ID
    if (overId.includes('-')) {
      targetColumnId = overId.split('-')[0];
    }

    const targetColumn = columns.find(col => col.id === targetColumnId);
    
    if (targetColumn && targetColumn.id !== activeSupplier.status) {
      try {
        // Optimistic update
        dispatch(optimisticUpdate({ 
          id: activeId, 
          data: { status: targetColumn.id } 
        }));
        
        // API call
        await dispatch(updateSupplierStatus({ 
          id: activeId, 
          status: targetColumn.id 
        })).unwrap();
        
        toast.success(`Zu "${targetColumn.name}" verschoben`);
      } catch (error) {
        console.error('Drag error:', error);
        toast.error('Fehler beim Verschieben');
        // Reload to get correct state
        dispatch(fetchSuppliers());
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `brandea_suppliers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export erfolgreich');
    } catch (error) {
      toast.error('Export fehlgeschlagen');
    }
  };

  // Filter suppliers based on search and status
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = searchQuery === '' || 
      supplier.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || supplier.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Group suppliers by status
  const suppliersByStatus = {};
  columns.forEach(col => {
    suppliersByStatus[col.id] = filteredSuppliers
      .filter(s => s.status === col.id)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
  });

  if (isLoading || columns.length === 0) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        />
        <div className="loading-text">Lade Daten...</div>
      </div>
    );
  }

  const activeSupplier = activeId ? suppliers.find(s => s.id === Number(activeId)) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>
              <LayoutDashboard className="header-icon" />
              Brandea CRM
            </h1>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Suche nach Firma, E-Mail oder Standort..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Lieferanten suchen"
              />
            </div>
          </div>

          <div className="header-actions">
            <span className="user-info">
              {user?.username}
            </span>
            
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="btn-icon"
              aria-label="Statistiken anzeigen"
            >
              <BarChart3 size={18} />
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
              aria-label="Neuer Lieferant hinzufügen"
            >
              <Plus size={18} />
              Neuer Lieferant
            </button>

            <button
              onClick={handleExport}
              className="btn-secondary"
              aria-label="Daten exportieren"
            >
              <Download size={18} />
              Export
            </button>

            <button
              onClick={() => dispatch(logout())}
              className="btn-logout"
              aria-label="Abmelden"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-content">
              <h3>{suppliers.length}</h3>
              <p>Gesamt Lieferanten</p>
            </div>
          </div>

          <div className="stat-card">
            <TrendingUp className="stat-icon" />
            <div className="stat-content">
              <h3>{suppliersByStatus.contacted?.length || 0}</h3>
              <p>Kontaktiert</p>
            </div>
          </div>

          <div className="stat-card">
            <Clock className="stat-icon" />
            <div className="stat-content">
              <h3>{suppliersByStatus.todo?.length || 0}</h3>
              <p>Zu kontaktieren</p>
            </div>
          </div>

          <div className="stat-card">
            <Filter className="stat-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
              aria-label="Nach Status filtern"
            >
              <option value="all">Alle Status</option>
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="kanban-board" role="region" aria-label="Kanban Board">
          {columns.map((column, columnIndex) => (
            <KanbanColumn
              key={column.id}
              column={column}
              suppliers={suppliersByStatus[column.id] || []}
              columnIndex={columnIndex}
              allColumns={columns}
              allSuppliersByStatus={suppliersByStatus}
              isActive={column.id === activeColumnId}
            />
          ))}
        </div>

        {/* Mobile Tab Navigation */}
        <div className="mobile-tabs">
          {columns.map((column) => (
            <button
              key={column.id}
              className={`mobile-tab ${column.id === activeColumnId ? 'active' : ''}`}
              onClick={() => setActiveColumnId(column.id)}
            >
              <span className="mobile-tab-count">
                {suppliersByStatus[column.id]?.length || 0}
              </span>
              <span>{column.name}</span>
            </button>
          ))}
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          className="fab"
          onClick={() => setShowAddForm(true)}
          aria-label="Neuer Lieferant hinzufügen"
        >
          <Plus size={24} />
        </button>

        <DragOverlay>
          {activeSupplier ? (
            <div className="drag-overlay">
              <SupplierCard
                supplier={activeSupplier}
                columns={columns}
                suppliersByStatus={suppliersByStatus}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>

        <AnimatePresence>
          {showAddForm && (
            <AddSupplierForm
              onClose={() => setShowAddForm(false)}
              columns={columns}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStatistics && (
            <Statistics
              onClose={() => setShowStatistics(false)}
              suppliers={suppliers}
              columns={columns}
            />
          )}
        </AnimatePresence>

        <footer className="dashboard-footer">
          © 2025 Brandea - Ein Tool von Brandea
        </footer>
      </div>
    </DndContext>
  );
}

// Separate Column Component for better drop zone handling
function KanbanColumn({ column, suppliers, columnIndex, allColumns, allSuppliersByStatus, isActive }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <motion.div
      className={`kanban-column ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: columnIndex * 0.1 }}
    >
      <div 
        ref={setNodeRef}
        className={`column-header ${isOver ? 'drop-zone-active' : ''}`}
      >
        <h2>{column.name}</h2>
        <span className="column-count">
          {suppliers.length}
        </span>
      </div>
      
      <SortableContext
        items={suppliers.map(s => s.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <DropZone columnId={`${column.id}-content`}>
          <div className="column-content" role="list" aria-label={`${column.name} Spalte`}>
            <AnimatePresence>
              {suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  columns={allColumns}
                  suppliersByStatus={allSuppliersByStatus}
                />
              ))}
            </AnimatePresence>
            
            {suppliers.length === 0 && (
              <div className="empty-column">
                <p>Keine Lieferanten in dieser Spalte</p>
              </div>
            )}
          </div>
        </DropZone>
      </SortableContext>
    </motion.div>
  );
}

// Simple Drop Zone Component
function DropZone({ columnId, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone ${isOver ? 'drop-zone-active' : ''}`}
    >
      {children}
    </div>
  );
}

export default Dashboard;