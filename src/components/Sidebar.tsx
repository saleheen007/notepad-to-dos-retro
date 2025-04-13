
import React from 'react';
import { Category } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <div className="min-h-[calc(100vh-2rem)] p-4 border-r border-notepad-dark bg-notepad-accent">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">RetroTasks</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
          className="h-8 w-8"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>
      
      <h2 className="text-lg mb-2">Categories</h2>
      
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory.id === category.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(category)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>
      
      <div className="mt-8 text-xs text-center text-notepad-dark">
        <p>Retro To-Do List</p>
        <p>© 2025</p>
      </div>
    </div>
  );
};

export default Sidebar;
