import { DndContext } from '@dnd-kit/core';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { Link } from 'react-router-dom';
import './Overview.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Overview() {
  const containers = ['todo', 'in-progress', 'done']; // Match DB enum values
  const [tickets, setTickets] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    designee: 'Unassigned',
    description: '',
    priority: 1 // Added priority as per DB schema
  });
  const [teamMembers, setTeamMembers] = useState([]);

  // Base API URL - adjust this to your backend endpoint
  const API_URL = 'http://localhost:3000/api'; // Change this to your actual API URL

  // Fetch initial data
  useEffect(() => {
    fetchTickets();
    fetchTeamMembers();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/cards`);
      // Map DB fields to match frontend structure
      const mappedTickets = response.data.map(ticket => ({
        id: ticket.id.toString(),
        title: ticket.title,
        description: ticket.description,
        assignee: ticket.designee,
        parent: ticket.status,
        priority: ticket.priority
      }));
      setTickets(mappedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // Assuming you have an endpoint for users
      const response = await axios.get(`${API_URL}/users`);
      const members = response.data.map(user => user.name); // Adjust based on your users table
      setTeamMembers([...members, 'Unassigned']);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers(['Donald Trump', 'Kamala Harris', 'Unassigned']); // Fallback
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTicket({ 
      title: '', 
      designee: 'Unassigned', 
      description: '', 
      priority: 1 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.title) return;

    const ticketData = {
      title: newTicket.title,
      description: newTicket.description || null,
      priority: parseInt(newTicket.priority),
      status: 'todo',
      author: 'current_user', // Replace with actual authenticated user
      designee: newTicket.designee === 'Unassigned' ? null : newTicket.designee
    };

    try {
      const response = await axios.post(`${API_URL}/cards`, ticketData);
      const createdTicket = {
        id: response.data.id.toString(),
        title: response.data.title,
        description: response.data.description,
        assignee: response.data.designee,
        parent: response.data.status,
        priority: response.data.priority
      };
      setTickets(prevTickets => [...prevTickets, createdTicket]);
      closeModal();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    try {
      const ticketToUpdate = tickets.find(t => t.id === active.id);
      if (ticketToUpdate) {
        const updatedTicket = { ...ticketToUpdate, parent: over.id };
        await axios.put(`${API_URL}/cards/${active.id}`, {
          status: over.id
        });
        
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === active.id ? updatedTicket : ticket
          )
        );
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  return (
    <div className="container">
             {/* Sidebar */}
      {isSidebarVisible && (
        <div className="sidebar">
    
          <button
            className="ticket-button"
            type="button"
            onClick={openModal}
            aria-label="Create a new ticket"
          >
            Create a Ticket
          </button>
          <Link to="/settings" className="linked-sidebar-button">Settings</Link>
          <Link to="/dashboard" className="linked-sidebar-button">Dashboard</Link>
          <button className="sidebar-button">All Tickets</button>
          <Link to="/settings" className="linked-sidebar-button">Settings</Link>
          
        </div>
      )}


      {/* Main content */}
      <div className="main-content">
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
                    .filter(ticket => ticket.parent === id)
                    .map(ticket => (
                      <Draggable key={ticket.id} id={ticket.id}>
                        <div className="ticket-card" data-parent={ticket.parent}>
                          <h4>{ticket.title}</h4>
                          <p>Assigned to: {ticket.assignee || 'Unassigned'}</p>
                          <p>{ticket.description || 'No description'}</p>
                          <p>Priority: {ticket.priority}</p>
                        </div>
                      </Draggable>
                    ))}
                  {tickets.filter(ticket => ticket.parent === id).length === 0 && (
                    <div className="empty-droppable">No tickets here</div>
                  )}
                </Droppable>
              </div>
            ))}
          </DndContext>
        </div>
      </div>

      {/* Modal for ticket creation */}
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
                <label htmlFor="designee">Assignee:</label>
                <select
                  id="designee"
                  name="designee"
                  value={newTicket.designee}
                  onChange={handleInputChange}
                >
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
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
    </div>
  );
}

export default Overview;