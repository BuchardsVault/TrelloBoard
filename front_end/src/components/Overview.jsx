import { DndContext } from '@dnd-kit/core';
import React, { useState } from 'react';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { Link } from 'react-router-dom';
import './Overview.css';

function Overview() {
  const containers = ['To Do', 'In Progress', 'Done']; // This is the droppable 
  const [tickets, setTickets] = useState([]); 
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Side bar
  const [isModalOpen, setIsModalOpen] = useState(false); // auto default to no popup 
  const [newTicket, setNewTicket] = useState({
    title: '',
    assignee: '',
    description: ''
  });


  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  
  // Opens popup window for input and then creates the ticket 
  const openModal = () => setIsModalOpen(true); 
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTicket({ title: '', assignee: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  // Instructions to execute when clicking on the create ticket button 
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (newTicket.title) { // Basic validation
      const ticket = {
        id: `ticket-${Date.now()}`,
        ...newTicket,
        parent: 'To Do' // Places in the To Do droppable 
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
          <h3>Sidebar</h3>
          <button 
            className="ticket-button" 
            type="button"
            onClick={openModal}
          >
            Create a Ticket
          </button>
          <button className="sidebar-button">Releases</button>
          <button className="sidebar-button">Components</button>
          <button className="sidebar-button">Tickets</button>
          <Link to="/settings" className="linked-sidebar-button">Settings</Link>
          <Link to="/dashboard" className="linked-sidebar-button">Dashboard</Link>
        </div>
      )}

      {/* Main content */}
      <div className="main-content">
        <button onClick={toggleSidebar} className="toggle-button">
          {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
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
                        <div className="ticket-card">
                          <h4>{ticket.title}</h4>
                          <p>Assigned to: {ticket.assignee || 'Unassigned'}</p>
                          <p>{ticket.description || 'No description'}</p>
                        </div>
                      </Draggable>
                    ))}
                  {tickets.filter(ticket => ticket.parent === id).length === 0 && (
                    <div className="empty-droppable"></div>
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
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newTicket.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assignee:</label>
                <input
                  type="text"
                  name="assignee"
                  value={newTicket.assignee}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
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