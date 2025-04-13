
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task, Category, categories } from '@/lib/data';
import TaskItem from './TaskItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfettiEffect from './ConfettiEffect';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  category: Category;
  updateTasks: (newTasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, category, updateTasks }) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>(category.id);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  
  // Filter tasks by category
  useEffect(() => {
    setFilteredTasks(tasks.filter(task => task.categoryId === category.id));
    setSelectedCategory(category.id);
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
  
  // Delete a task
  const deleteTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const taskToDelete = tasks[taskIndex];
    const newTasks = tasks.filter(t => t.id !== taskId);
    
    updateTasks(newTasks);
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete.title}" has been removed.`,
    });
  };
  
  // Add a new task
  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      categoryId: selectedCategory,
      dueDate: selectedDate ? selectedDate.toISOString() : undefined
    };
    
    updateTasks([...tasks, newTask]);
    
    // Reset form
    setNewTaskTitle('');
    setSelectedDate(undefined);
    setSelectedCategory(category.id);
    setShowAddTaskDialog(false);
    
    toast({
      title: "Task added",
      description: "New task has been added to your list.",
    });
  };

  // Handle opening the add task dialog
  const openAddTaskDialog = () => {
    setSelectedCategory(category.id);
    setShowAddTaskDialog(true);
  };
  
  return (
    <div className="notepad-paper torn-edge">
      <h2 className="text-2xl mb-6 font-bold flex items-center">
        <span className="mr-2">{category.icon}</span>
        {category.name} ({filteredTasks.filter(t => !t.completed).length} remaining)
      </h2>
      
      <div className="mb-6">
        <Button 
          onClick={openAddTaskDialog}
          className="bg-notepad-accent hover:bg-notepad-dark text-notepad-ink flex gap-2"
        >
          <Plus size={16} />
          Add Task
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
              deleteTask={deleteTask}
            />
          ))}
          
          {filteredTasks.length === 0 && (
            <p className="italic text-notepad-dark">No tasks in this category yet. Add some!</p>
          )}
        </div>
      </DndProvider>
      
      <ConfettiEffect isActive={showConfetti} />

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="bg-notepad-paper border-notepad-dark">
          <DialogHeader>
            <DialogTitle className="text-notepad-ink">Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <label className="text-sm font-medium block mb-1">Task Name</label>
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="border-notepad-line focus:border-notepad-dark"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Due Date (optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full border-notepad-line focus:border-notepad-dark">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-notepad-accent hover:bg-notepad-dark text-notepad-ink"
              onClick={addNewTask}
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
