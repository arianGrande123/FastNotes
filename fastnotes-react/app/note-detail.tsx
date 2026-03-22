import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NoteDetailScreen() {
  const router = useRouter();
  const { title, content } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 48, marginBottom: 16 },
  content: { fontSize: 16, color: '#333' },
  backButton: { position: 'absolute', bottom: 32, left: 24, backgroundColor: '#4F86F7', padding: 16, borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});