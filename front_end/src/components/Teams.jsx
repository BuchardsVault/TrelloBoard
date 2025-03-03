import {DndContext} from '@dnd-kit/core';
import React, { useState } from 'react';
import {Droppable} from './Droppable';
import {Draggable} from './Draggable';
import { Link } from 'react-router-dom';
import './Teams.css'; // Import the CSS file

function Teams() {
  const containers = ['To Do', 'In Progress', 'Done'];
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="draggable">Drag me</Draggable>
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  
  return (
    <div className="container">
      {/* Sidebar */}
      {isSidebarVisible && (
        <div className="sidebar">
          <h3>Sidebar</h3>
          <button className="sidebar-button">Create a Ticket</button>
          <button className="sidebar-button">Releases</button>
          <button className="sidebar-button">Components</button>
          <button className="sidebar-button">Tickets</button>
          <Link to="/settings" className="linked-sidebar-button">
             Settings
          </Link>
          <Link to="/dashboard" className="linked-sidebar-button">
             Dashboard
          </Link>
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
                  {parent === id ? draggableMarkup : <div className="empty-droppable"></div>}
                </Droppable>
              </div>
            ))}
            {parent === null ? draggableMarkup : null}
          </DndContext>
        </div>
      </div>
    </div>
  );

  function handleDragEnd(event) {
    const {over} = event;
    setParent(over ? over.id : null);
  }
};

export default Teams;