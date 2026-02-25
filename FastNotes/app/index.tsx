import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotes } from './notesContext';

export default function HomeScreen() {
  const router = useRouter();
  const { notes } = useNotes();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 FastNotes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.noteItem}>
            <Text style={styles.noteTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/new-note')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, marginTop: 48 },
  noteItem: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 8 },
  noteTitle: { fontSize: 16 },
  fab: { position: 'absolute', bottom: 32, right: 24, backgroundColor: '#4F86F7', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36 },
});