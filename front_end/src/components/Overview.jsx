import {DndContext} from '@dnd-kit/core';
import React, { useState } from 'react';
import {Droppable} from './Droppable';
import {Draggable} from './Draggable';

function Overview() {
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
  <div style={{ display: 'flex', height: '100vh' }}>
    {/* Sidebar */}
    {isSidebarVisible && (
      <div style={{ width: '160px', backgroundColor: '#333', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h3 style={{ textAlign: 'center' }}>Sidebar</h3>
      <button style={{ width: '75%', padding: '10px', marginBottom: '10px'}}>Create a Ticket</button>
      <button style={{ width: '75%', padding: '10px', marginBottom: '10px' }}>Releases</button>
      <button style={{ width: '75%', padding: '10px', marginBottom: '10px' }}>components</button>
      <button style={{ width: '75%', padding: '10px', marginBottom: '10px' }}>Tickets</button>
      <button style={{ width: '75%', padding: '10px', marginBottom: '10px' }}>Settings</button>
    </div>
  )}
    {/* Main content */}
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <button onClick={toggleSidebar} style={{ alignSelf: 'flex-start', margin: '10px' }}>
            {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
        <DndContext onDragEnd={handleDragEnd}>
          {containers.map((id) => (
            <div key={id} style={{ width: '400px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', margin: '0 10px' }}>
              <h3 style={{ textAlign: 'center' }}>{id}</h3>
              <Droppable id={id} style={{ Height: '600px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
                {parent === id ? draggableMarkup : <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', height: '100%' }}></div>}
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

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
};

export default Overview;