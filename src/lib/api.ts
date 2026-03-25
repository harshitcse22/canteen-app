import { Snack, Student, Order } from '../types';

let snacks: Snack[] = [
  { id: '1', name: 'Samosa', price: 15, ordersCount: 0 },
  { id: '2', name: 'Puff', price: 20, ordersCount: 0 },
  { id: '3', name: 'Sandwich', price: 30, ordersCount: 0 },
  { id: '4', name: 'Juice', price: 25, ordersCount: 0 },
  { id: '5', name: 'Cake', price: 40, ordersCount: 0 },
];

let students: Student[] = [
  { id: '101', name: 'Rahul Kumar', referralCode: 'RAH123', totalSpent: 0 },
  { id: '102', name: 'Priya Sharma', referralCode: 'PRI456', totalSpent: 0 },
];

let orders: Order[] = [];

if (typeof window !== 'undefined') {
  try {
    const savedSnacks = localStorage.getItem('canteen_snacks');
    if (savedSnacks) snacks = JSON.parse(savedSnacks);

    const savedStudents = localStorage.getItem('canteen_students');
    if (savedStudents) students = JSON.parse(savedStudents);

    const savedOrders = localStorage.getItem('canteen_orders');
    if (savedOrders) orders = JSON.parse(savedOrders);
  } catch (e) {
    console.error("Error loading mock local storage data", e);
  }
}

const saveState = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('canteen_snacks', JSON.stringify(snacks));
    localStorage.setItem('canteen_students', JSON.stringify(students));
    localStorage.setItem('canteen_orders', JSON.stringify(orders));
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSnacks = async (): Promise<Snack[]> => {
  await delay(300);
  return [...snacks];
};

export const getStudents = async (): Promise<Student[]> => {
  await delay(300);
  return [...students];
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  await delay(300);
  return students.find((s) => s.id === id);
};

export const createStudent = async (name: string): Promise<Student> => {
  await delay(500);
  const newStudent: Student = {
    id: Date.now().toString(),
    name,
    referralCode: name.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900),
    totalSpent: 0,
  };
  students.push(newStudent);
  saveState();
  return newStudent;
};

export const createOrder = async (studentId: string, snackId: string, quantity: number): Promise<Order> => {
  await delay(500);
  
  const snackIndex = snacks.findIndex((s) => s.id === snackId);
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (snackIndex === -1 || studentIndex === -1) {
    throw new Error('Snack or Student not found');
  }

  const snack = snacks[snackIndex];
  const payableAmount = snack.price * quantity;

  const newOrder: Order = {
    id: Date.now().toString(),
    studentId,
    snackId,
    quantity,
    payableAmount,
    createdAt: new Date().toISOString(),
  };

  snacks[snackIndex] = { ...snack, ordersCount: snack.ordersCount + quantity };
  students[studentIndex] = { ...students[studentIndex], totalSpent: students[studentIndex].totalSpent + payableAmount };
  
  orders.push(newOrder);
  saveState();

  return newOrder;
};

export const getOrdersByStudent = async (studentId: string): Promise<(Order & { snackName?: string })[]> => {
  await delay(300);
  return orders
    .filter((o) => o.studentId === studentId)
    .map((o) => ({
      ...o,
      snackName: snacks.find((s) => s.id === o.snackId)?.name || 'Unknown',
    }));
};
