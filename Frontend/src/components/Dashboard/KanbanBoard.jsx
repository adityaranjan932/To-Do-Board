import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import '../../css/KanbanBoard.css';

// Sortable Task Card Component
const SortableTaskCard = ({ task, onEdit, onDelete, onSmartAssign }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Don't attach listeners to action buttons
  const handleMouseDown = (e) => {
    if (e.target.closest('.task-actions')) {
      e.stopPropagation();
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onMouseDown={handleMouseDown}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onSmartAssign={onSmartAssign}
        isDragging={isDragging}
      />
    </div>
  );
};

// Droppable Column Component
const DroppableColumn = ({ column, tasks, onEdit, onDelete, onSmartAssign }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="kanban-column">
      <div 
        className="column-header"
        style={{ borderTopColor: column.color }}
      >
        <h3 className="column-title">{column.title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`column-content ${isOver ? 'drag-over' : ''}`}
      >
        <SortableContext items={tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onSmartAssign={onSmartAssign}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>No tasks yet</p>
            <span>Drag tasks here or create new ones</span>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask, onSmartAssign, onDragEnd }) => {
  const [activeId, setActiveId] = useState(null);
  
  const columns = [
    { id: 'Todo', title: '📝 To Do', color: '#e53e3e' },
    { id: 'In Progress', title: '⚡ In Progress', color: '#dd6b20' },
    { id: 'Done', title: '✅ Done', color: '#38a169' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the task being dragged
    const activeTask = tasks.find(task => task._id === activeId);
    if (!activeTask) return;

    // Determine the new status based on where it was dropped
    let newStatus = activeTask.status;

    // Check if dropped on a column
    if (['Todo', 'In Progress', 'Done'].includes(overId)) {
      newStatus = overId;
    } else {
      // Dropped on another task, find that task's status
      const overTask = tasks.find(task => task._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // If status changed, trigger the onDragEnd callback
    if (newStatus !== activeTask.status) {
      onDragEnd({
        draggableId: activeId,
        destination: { droppableId: newStatus },
        source: { droppableId: activeTask.status }
      });
    }
  };

  const activeTask = activeId ? tasks.find(task => task._id === activeId) : null;

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {columns.map(column => (
          <DroppableColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onSmartAssign={onSmartAssign}
          />
        ))}
        
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
