import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, Clock, CheckCircle, BarChart3, PieChart, Calendar, Target, Activity, Download, Share2, Filter } from 'lucide-react';
import { BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import './Statistics.css';

function Statistics({ onClose, suppliers, columns }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  
  // Calculate statistics
  const suppliersByStatus = {};
  columns.forEach(col => {
    suppliersByStatus[col.id] = suppliers.filter(s => s.status === col.id).length;
  });

  const suppliersByType = suppliers.reduce((acc, supplier) => {
    const type = supplier.type || 'Unbekannt';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const suppliersByLocation = suppliers.reduce((acc, supplier) => {
    const country = supplier.location?.split(',')[0]?.trim() || 'Unbekannt';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Calculate conversion rate
  const conversionRate = ((suppliersByStatus.done || 0) / suppliers.length * 100).toFixed(1);
  const contactRate = (((suppliersByStatus.contacted || 0) + (suppliersByStatus.offer || 0) + (suppliersByStatus.done || 0)) / suppliers.length * 100).toFixed(1);
  
  // Mock timeline data for premium chart
  const timelineData = [
    { month: 'Jan', contacted: 4, offers: 2, done: 1 },
    { month: 'Feb', contacted: 6, offers: 3, done: 2 },
    { month: 'Mär', contacted: 8, offers: 5, done: 3 },
    { month: 'Apr', contacted: 12, offers: 7, done: 5 },
    { month: 'Mai', contacted: 15, offers: 9, done: 6 },
    { month: 'Jun', contacted: 18, offers: 11, done: 8 },
  ];

  // Prepare data for charts
  const statusData = columns.map(col => ({
    name: col.name,
    value: suppliersByStatus[col.id] || 0,
    percentage: ((suppliersByStatus[col.id] || 0) / suppliers.length * 100).toFixed(1)
  }));

  const typeData = Object.entries(suppliersByType).map(([type, count]) => ({
    name: type,
    value: count
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const locationData = Object.entries(suppliersByLocation).map(([location, count]) => ({
    name: location,
    value: count
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const GRADIENT_COLORS = [
    { start: '#6366f1', end: '#4f46e5' },
    { start: '#8b5cf6', end: '#7c3aed' },
    { start: '#ec4899', end: '#db2777' },
    { start: '#f59e0b', end: '#d97706' },
    { start: '#10b981', end: '#059669' },
  ];

  return (
    <motion.div
      className="statistics-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="statistics-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="statistics-header">
          <div className="header-content">
            <h2>
              <BarChart3 className="header-icon" />
              Analytics Dashboard
            </h2>
            <span className="premium-badge">PRO</span>
          </div>
          <div className="header-actions">
            <button className="action-button">
              <Download size={20} />
              <span className="desktop-only">Export</span>
            </button>
            <button className="action-button">
              <Share2 size={20} />
              <span className="desktop-only">Teilen</span>
            </button>
            <button onClick={onClose} className="close-button" aria-label="Schließen">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="stats-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={18} />
            Überblick
          </button>
          <button 
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <TrendingUp size={18} />
            Verlauf
          </button>
          <button 
            className={`tab ${activeTab === 'targets' ? 'active' : ''}`}
            onClick={() => setActiveTab('targets')}
          >
            <Target size={18} />
            Ziele
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="time-range-selector">
          <button 
            className={`range-button ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            7 Tage
          </button>
          <button 
            className={`range-button ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            30 Tage
          </button>
          <button 
            className={`range-button ${timeRange === 'quarter' ? 'active' : ''}`}
            onClick={() => setTimeRange('quarter')}
          >
            Quartal
          </button>
          <button 
            className={`range-button ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Jahr
          </button>
        </div>

        <div className="statistics-content">
          {activeTab === 'overview' && (
          {/* Overview Cards */}
          <div className="stats-overview">
            <motion.div
              className="overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Users className="overview-icon" />
              <div className="overview-content">
                <h3>{suppliers.length}</h3>
                <p>Gesamt Lieferanten</p>
              </div>
            </motion.div>

            <motion.div
              className="overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="overview-icon" />
              <div className="overview-content">
                <h3>{suppliersByStatus.todo || 0}</h3>
                <p>Zu kontaktieren</p>
              </div>
            </motion.div>

            <motion.div
              className="overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="overview-icon" />
              <div className="overview-content">
                <h3>{suppliersByStatus.contacted || 0}</h3>
                <p>Kontaktiert</p>
              </div>
            </motion.div>

            <motion.div
              className="overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle className="overview-icon" />
              <div className="overview-content">
                <h3>{suppliersByStatus.completed || 0}</h3>
                <p>Abgeschlossen</p>
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            {/* Status Chart */}
            <motion.div
              className="chart-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3>Status-Verteilung</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {statusData.map((item, index) => (
                  <div key={item.name} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}: {item.value} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Type Chart */}
            <motion.div
              className="chart-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3>Top 5 Lieferanten-Typen</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Location Chart */}
            <motion.div
              className="chart-container full-width"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3>Top 5 Standorte</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Summary */}
          <motion.div
            className="statistics-summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3>Zusammenfassung</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <PieChart className="summary-icon" />
                <p>
                  <strong>{((suppliersByStatus.completed || 0) / suppliers.length * 100).toFixed(1)}%</strong> der Lieferanten wurden erfolgreich abgeschlossen
                </p>
              </div>
              <div className="summary-item">
                <TrendingUp className="summary-icon" />
                <p>
                  <strong>{typeData[0]?.name || 'Keine Daten'}</strong> ist der häufigste Lieferanten-Typ ({typeData[0]?.value || 0} Lieferanten)
                </p>
              </div>
              <div className="summary-item">
                <Users className="summary-icon" />
                <p>
                  <strong>{locationData[0]?.name || 'Keine Daten'}</strong> hat die meisten Lieferanten ({locationData[0]?.value || 0} Lieferanten)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Statistics;