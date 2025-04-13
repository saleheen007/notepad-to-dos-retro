
import React, { useState, useEffect } from 'react';
import { categories, tasks as initialTasks, Task, Category } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Handle category selection
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop or when open on mobile */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} w-64 md:block shrink-0`}>
        <Sidebar 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleSelectCategory}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4">
        {/* Mobile header with toggle */}
        <div className="md:hidden flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(prev => !prev)}
            className="mr-2"
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-xl font-bold">{selectedCategory.name}</h1>
        </div>
        
        {/* Task list */}
        <div className="max-w-3xl mx-auto">
          <TaskList 
            tasks={tasks} 
            category={selectedCategory} 
            updateTasks={setTasks} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
