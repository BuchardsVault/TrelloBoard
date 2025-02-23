import React, { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease',
    padding: '12px 16px',
    margin: '0 0 8px 0',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'grab',
    opacity: isDragging ? 0.7 : 1,
    fontSize: '14px',
    color: '#333',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
}

function Overview() {
  const [tasks, setTasks] = useState({
    todo: [{ id: 'task-1', content: 'Task 1' }],
    inProgress: [{ id: 'task-2', content: 'Task 2' }],
    done: [{ id: 'task-3', content: 'Task 3' }],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log('Drag End - Active:', active.id, 'Over:', over?.id || 'null');

    if (!over) return;

    const sourceColumn = Object.keys(tasks).find((col) =>
      tasks[col].some((task) => task.id === active.id)
    );
    if (!sourceColumn) return;

    let targetColumn = over.id;
    if (!(over.id in tasks)) {
      targetColumn = Object.keys(tasks).find((col) =>
        tasks[col].some((task) => task.id === over.id)
      ) || Object.keys(tasks).find((col) => over.id.startsWith(col)) || over.id;
    }

    if (!tasks[targetColumn]) return;

    if (sourceColumn === targetColumn) {
      const columnTasks = [...tasks[sourceColumn]];
      const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.id === over.id);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks({ ...tasks, [sourceColumn]: newColumnTasks });
    } else {
      const sourceTasks = [...tasks[sourceColumn]];
      const destTasks = [...tasks[targetColumn]];
      const movedTaskIndex = sourceTasks.findIndex((task) => task.id === active.id);
      if (movedTaskIndex === -1) return;
      const [movedTask] = sourceTasks.splice(movedTaskIndex, 1);

      let destIndex = over.id === targetColumn ? destTasks.length : destTasks.findIndex((task) => task.id === over.id);
      if (destIndex === -1) destIndex = destTasks.length;

      destTasks.splice(destIndex, 0, movedTask);

      setTasks({
        ...tasks,
        [sourceColumn]: sourceTasks,
        [targetColumn]: destTasks,
      });
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f4f5f7',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#172b4d',
        marginBottom: '20px',
        textAlign: 'center',
      }}>Overview</h2>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap', // Responsive wrapping
          justifyContent: 'center', // Center columns on smaller screens
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <SortableContext key={columnId} items={columnTasks.map((task) => task.id)} id={columnId}>
              <div style={{
                backgroundColor: '#ebecf0',
                padding: '12px',
                width: '280px',
                minHeight: '400px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.2s ease',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }, // Note: Pseudo-classes need CSS file
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#172b4d',
                  marginBottom: '12px',
                  paddingLeft: '4px',
                }}>{columnId.replace(/([A-Z])/g, ' $1').toUpperCase()}</h3>
                <div style={{ minHeight: '1px' }}> {/* Ensures empty columns stay droppable */}
                  {columnTasks.map((task) => (
                    <SortableItem key={task.id} id={task.id} content={task.content} />
                  ))}
                </div>
              </div>
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Overview;