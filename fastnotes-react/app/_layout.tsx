import { Stack } from "expo-router";
import { NotesProvider } from "./notesContext";

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack />
    </NotesProvider>
  );
}