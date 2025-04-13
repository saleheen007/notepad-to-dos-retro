
// Define the Task interface
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  categoryId: string;
}

// Define the Category interface
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Create our dummy data
export const categories: Category[] = [
  {
    id: "work",
    name: "Work",
    icon: "💼",
  },
  {
    id: "personal",
    name: "Personal",
    icon: "👤",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛒",
  },
  {
    id: "health",
    name: "Health",
    icon: "💪",
  },
  {
    id: "ideas",
    name: "Ideas",
    icon: "💡",
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Complete quarterly report",
    completed: false,
    dueDate: "2025-04-15",
    categoryId: "work",
  },
  {
    id: "task-2",
    title: "Review team presentations",
    completed: true,
    categoryId: "work",
  },
  {
    id: "task-3",
    title: "Schedule client meeting",
    completed: false,
    dueDate: "2025-04-20",
    categoryId: "work",
  },
  {
    id: "task-4",
    title: "Prepare for conference",
    completed: false,
    categoryId: "work",
  },
  {
    id: "task-5",
    title: "Buy birthday gift for mom",
    completed: false,
    dueDate: "2025-04-25",
    categoryId: "personal",
  },
  {
    id: "task-6",
    title: "Call insurance company",
    completed: true,
    categoryId: "personal",
  },
  {
    id: "task-7",
    title: "Schedule dentist appointment",
    completed: false,
    categoryId: "health",
  },
  {
    id: "task-8",
    title: "Plan weekend getaway",
    completed: false,
    categoryId: "personal",
  },
  {
    id: "task-9",
    title: "Milk",
    completed: true,
    categoryId: "shopping",
  },
  {
    id: "task-10",
    title: "Eggs",
    completed: false,
    categoryId: "shopping",
  },
  {
    id: "task-11",
    title: "Bread",
    completed: false,
    categoryId: "shopping",
  },
  {
    id: "task-12",
    title: "Coffee beans",
    completed: false,
    categoryId: "shopping",
  },
  {
    id: "task-13",
    title: "Morning jog",
    completed: false,
    dueDate: "2025-04-14",
    categoryId: "health",
  },
  {
    id: "task-14",
    title: "Take vitamins",
    completed: true,
    categoryId: "health",
  },
  {
    id: "task-15",
    title: "App for vintage photo filters",
    completed: false,
    categoryId: "ideas",
  },
  {
    id: "task-16",
    title: "Recipe book for comfort food",
    completed: false,
    categoryId: "ideas",
  },
];
