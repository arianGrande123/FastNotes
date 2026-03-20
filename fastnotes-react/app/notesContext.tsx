import { createContext, useContext, useState } from 'react';

type Note = {
  id: string;
  title: string;
  content: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (title: string, content: string) => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Test note', content: 'This is a test note' }
  ]);

  function addNote(title: string, content: string) {
    setNotes(prev => [...prev, { id: Date.now().toString(), title, content }]);
  }

  return (
    <NotesContext.Provider value={{ notes, addNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within NotesProvider');
  return context;
}