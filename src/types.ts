// Type definitions for the expense split app

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splitBetween: string[];
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  expenses: Expense[];
} 