import { DndContext } from '@dnd-kit/core';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './Overview.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Overview() {
  const navigate = useNavigate();
  const containers = ['todo', 'in-progress', 'done'];
  const [tickets, setTickets] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    designee_id: null,
    description: '',
    priority: 1,
  });
  const [editTicket, setEditTicket] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api');
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000');
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    let isMounted = true;
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('ticketCreated', (newTicket) => {
      if (isMounted) {
        setTickets((prev) => [
          ...prev,
          {
            id: newTicket.id.toString(),
            title: newTicket.title,
            description: newTicket.description,
            assignee: teamMembers.find((m) => m.id === newTicket.designee_id)?.name || 'Unassigned',
            assigneeId: newTicket.designee_id,
            parent: newTicket.status,
            priority: newTicket.priority,
          },
        ]);
      }
    });

    socket.on('ticketUpdated', (updatedTicket) => {
      if (isMounted) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === updatedTicket.id.toString()
              ? {
                  ...ticket,
                  ...updatedTicket,
                  assignee: teamMembers.find((m) => m.id === updatedTicket.designee_id)?.name || 'Unassigned',
                }
              : ticket
          )
        );
      }
    });

    socket.on('ticketDeleted', ({ id }) => {
      if (isMounted) {
        setTickets((prev) => prev.filter((ticket) => ticket.id !== id.toString()));
      }
    });

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/cards`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 5000,
        });
        if (isMounted) {
          const mappedTickets = response.data.map((ticket) => ({
            id: ticket.id.toString(),
            title: ticket.title,
            description: ticket.description,
            assignee: ticket.designee,
            assigneeId: ticket.designee_id,
            parent: ticket.status,
            priority: ticket.priority,
          }));
          setTickets(mappedTickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 5000,
        });
        if (isMounted) setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error.message);
      }
    };

    fetchTickets();
    fetchTeamMembers();

    return () => {
      isMounted = false;
      socket.disconnect();
      console.log('Socket cleanup complete');
    };
  }, [API_URL, SOCKET_URL, teamMembers]); // Added teamMembers to dependency array

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTicket({ title: '', designee_id: null, description: '', priority: 1 });
  };

  const openEditModal = (ticket) => {
    setEditTicket({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description || '',
      priority: ticket.priority,
      designee_id: ticket.assigneeId,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTicket(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: name === 'designee_id' ? (value === '' ? null : parseInt(value)) : value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTicket((prev) => ({
      ...prev,
      [name]: name === 'designee_id' ? (value === '' ? null : parseInt(value)) : value,
    }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.title) return;

    const ticketData = {
      title: newTicket.title,
      description: newTicket.description || null,
      priority: parseInt(newTicket.priority),
      status: 'todo',
      author_id: currentUser.id,
      designee_id: newTicket.designee_id,
    };

    try {
      await axios.post(`${API_URL}/cards`, ticketData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      closeModal();
    } catch (error) {
      console.error('Error creating ticket:', error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!editTicket.title) return;

    const ticketData = {
      title: editTicket.title,
      description: editTicket.description || null,
      priority: parseInt(editTicket.priority),
      designee_id: editTicket.designee_id,
    };

    try {
      await axios.put(`${API_URL}/cards/${editTicket.id}`, ticketData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      closeEditModal();
    } catch (error) {
      console.error('Error updating ticket:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await axios.delete(`${API_URL}/cards/${editTicket.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      closeEditModal();
      // Optionally emit via socket if server doesn't already
      // socket.emit('deleteTicket', { id: editTicket.id });
    } catch (error) {
      console.error('Error deleting ticket:', error.response ? error.response.data : error.message);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    try {
      const ticketToUpdate = tickets.find((t) => t.id === active.id);
      if (ticketToUpdate) {
        await axios.put(
          `${API_URL}/cards/${active.id}`,
          { status: over.id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        // Optionally emit via socket if server doesn't already
        // socket.emit('updateTicket', { id: active.id, status: over.id });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error.response ? error.response.data : error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      {isSidebarVisible && (
        <div className="sidebar">
          <button className="nav-button" onClick={openModal}>Create a Ticket</button>
          <Link to="/dashboard">
            <button className="nav-button">Dashboard</button>
          </Link>
          <button className="nav-button">All Tickets</button>
          <Link to="/settings">
            <button className="nav-button">Settings</button>
          </Link>
        </div>
      )}

      <div className="main-content">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button
          onClick={toggleSidebar}
          className="toggle-button"
          aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
        >
          {isSidebarVisible ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        <div className="board-container">
          <DndContext onDragEnd={handleDragEnd}>
            {containers.map((id) => (
              <div key={id} className="column">
                <h3>{id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ')}</h3>
                <Droppable id={id} className="droppable">
                  {tickets
                    .filter((ticket) => ticket.parent === id)
                    .map((ticket) => (
                      <Draggable key={ticket.id} id={ticket.id}>
                        <div
                          className="ticket-card"
                          data-parent={ticket.parent}
                          onClick={() => openEditModal(ticket)}
                          style={{ cursor: 'pointer' }}
                        >
                          <h4>{ticket.title}</h4>
                          <p>Assigned to: {ticket.assignee || 'Unassigned'}</p>
                          <p>{ticket.description || 'No description'}</p>
                          <p>Priority: {ticket.priority}</p>
                        </div>
                      </Draggable>
                    ))}
                  {tickets.filter((ticket) => ticket.parent === id).length === 0 && (
                    <div className="empty-droppable">No tickets here</div>
                  )}
                </Droppable>
              </div>
            ))}
          </DndContext>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={newTicket.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="designee_id">Assignee:</label>
                <select
                  id="designee_id"
                  name="designee_id"
                  value={newTicket.designee_id || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <input
                  id="priority"
                  type="number"
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button">Create</button>
                <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Ticket</h2>
            <form onSubmit={handleUpdateTicket}>
              <div className="form-group">
                <label htmlFor="edit-title">Title:</label>
                <input
                  id="edit-title"
                  type="text"
                  name="title"
                  value={editTicket.title}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-designee_id">Assignee:</label>
                <select
                  id="edit-designee_id"
                  name="designee_id"
                  value={editTicket.designee_id || ''}
                  onChange={handleEditInputChange}
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-priority">Priority:</label>
                <input
                  id="edit-priority"
                  type="number"
                  name="priority"
                  value={editTicket.priority}
                  onChange={handleEditInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-description">Description:</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editTicket.description}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button">Update</button>
                <button type="button" onClick={handleDeleteTicket} className="delete-button">Delete</button>
                <button type="button" onClick={closeEditModal} className="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Overview;