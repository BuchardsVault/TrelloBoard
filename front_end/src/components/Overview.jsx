import { DndContext } from '@dnd-kit/core';
import React, { useState } from 'react';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { Link } from 'react-router-dom';
import './Overview.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Overview() {
  const containers = ['To Do', 'In Progress', 'Done'];
  const [tickets, setTickets] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    assignee: 'Unassigned',
    description: ''
  });
  const teamMembers = ['Alice', 'Bob', 'Charlie', 'Unassigned'];

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTicket({ title: '', assignee: 'Unassigned', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (newTicket.title) {
      const ticket = {
        id: `ticket-${Date.now()}`,
        ...newTicket,
        parent: 'To Do'
      };
      setTickets(prevTickets => [...prevTickets, ticket]);
      closeModal();
    }
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over) {
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === active.id
            ? { ...ticket, parent: over.id }
            : ticket
        )
      );
    }
  }

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
                <h3>{id}</h3>
                <Droppable id={id} className="droppable">
                  {tickets
                    .filter(ticket => ticket.parent === id)
                    .map(ticket => (
                      <Draggable key={ticket.id} id={ticket.id}>
                        <div className="ticket-card" data-parent={ticket.parent}>
                          <h4>{ticket.title}</h4>
                          <p>Assigned to: {ticket.assignee}</p>
                          <p>{ticket.description || 'No description'}</p>
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
                  aria-required="true"
                />
              </div>
              <div className="form-group">
                <label htmlFor="assignee">Assignee:</label>
                <select
                  id="assignee"
                  name="assignee"
                  value={newTicket.assignee}
                  onChange={handleInputChange}
                >
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
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