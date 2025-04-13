
import React, { useRef } from 'react';
import { Task } from '@/lib/data';
import { useDrag, useDrop } from 'react-dnd';
import { Check, Calendar, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  toggleTaskComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, moveTask, toggleTaskComplete, deleteTask }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Set up drop functionality
  const [, drop] = useDrop({
    accept: 'TASK',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Get rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Get mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveTask(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  
  // Initialize drag and drop
  drag(drop(ref));
  
  return (
    <div 
      ref={ref}
      className={cn(
        "p-3 mb-2 border-b border-notepad-line flex items-center gap-3 transition-opacity",
        isDragging ? "opacity-40" : "opacity-100",
        task.completed ? "task-completed" : ""
      )}
      style={{ cursor: 'move' }}
    >
      <div className="relative flex-shrink-0">
        <div 
          className={cn(
            "retro-checkbox-container",
            task.completed ? "retro-checkbox-checked" : ""
          )}
          onClick={() => toggleTaskComplete(task.id)}
        >
          <div className="retro-checkbox">
            {task.completed && (
              <Check size={12} className="text-notepad-ink absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-md">{task.title}</p>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-notepad-dark mt-1">
            <Calendar size={12} className="mr-1" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="text-notepad-dark hover:text-red-500 transition-colors p-1 rounded-md hover:bg-notepad-paper"
        title="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TaskItem;
