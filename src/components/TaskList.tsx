
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task, Category } from '@/lib/data';
import TaskItem from './TaskItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfettiEffect from './ConfettiEffect';

interface TaskListProps {
  tasks: Task[];
  category: Category;
  updateTasks: (newTasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, category, updateTasks }) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  
  // Filter tasks by category
  useEffect(() => {
    setFilteredTasks(tasks.filter(task => task.categoryId === category.id));
  }, [tasks, category]);
  
  // Handle reordering of tasks
  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedTask = filteredTasks[dragIndex];
      const newTasks = [...filteredTasks];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      
      setFilteredTasks(newTasks);
      
      // Update the main task list while preserving category order
      const updatedTasks = [...tasks];
      const categoryTasks = updatedTasks.filter(task => task.categoryId === category.id);
      const otherTasks = updatedTasks.filter(task => task.categoryId !== category.id);
      
      // Replace the tasks for this category with the reordered ones
      const reorderedCategoryTasks = newTasks.map(task => {
        const originalTask = categoryTasks.find(t => t.id === task.id);
        return originalTask || task;
      });
      
      updateTasks([...reorderedCategoryTasks, ...otherTasks]);
    },
    [filteredTasks, tasks, category.id, updateTasks]
  );
  
  // Toggle task completion
  const toggleTaskComplete = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const newTasks = [...tasks];
    const updatedTask = { ...newTasks[taskIndex], completed: !newTasks[taskIndex].completed };
    newTasks[taskIndex] = updatedTask;
    
    // Show confetti if task is being marked as completed
    if (updatedTask.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      toast({
        title: "Task completed!",
        description: "Great job crossing that off your list.",
      });
    }
    
    updateTasks(newTasks);
  };
  
  // Add a new task
  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      categoryId: category.id,
    };
    
    updateTasks([...tasks, newTask]);
    setNewTaskTitle('');
    
    toast({
      title: "Task added",
      description: "New task has been added to your list.",
    });
  };
  
  // Handle key press for adding tasks
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addNewTask();
    }
  };
  
  return (
    <div className="notepad-paper torn-edge">
      <h2 className="text-2xl mb-6 font-bold flex items-center">
        <span className="mr-2">{category.icon}</span>
        {category.name} ({filteredTasks.filter(t => !t.completed).length} remaining)
      </h2>
      
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-transparent border-b border-notepad-line focus:border-notepad-dark rounded-none"
        />
        <Button 
          onClick={addNewTask}
          className="bg-notepad-accent hover:bg-notepad-dark text-notepad-ink"
        >
          <Plus size={16} />
        </Button>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <div>
          {filteredTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              moveTask={moveTask}
              toggleTaskComplete={toggleTaskComplete}
            />
          ))}
          
          {filteredTasks.length === 0 && (
            <p className="italic text-notepad-dark">No tasks in this category yet. Add some!</p>
          )}
        </div>
      </DndProvider>
      
      <ConfettiEffect isActive={showConfetti} />
    </div>
  );
};

export default TaskList;
