import { create } from 'zustand';

interface AppState {
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  
  // UI State for ordering
  isOrderModalOpen: boolean;
  setOrderModalOpen: (isOpen: boolean) => void;
  
  selectedSnackId: string | null;
  setSelectedSnackId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStudentId: null,
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
  
  isOrderModalOpen: false,
  setOrderModalOpen: (isOpen) => set({ isOrderModalOpen: isOpen }),
  
  selectedSnackId: null,
  setSelectedSnackId: (id) => set({ selectedSnackId: id }),
}));
