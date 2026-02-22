import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function NewNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.header}>New Note</Text>

        <TextInput
          style={styles.titleInput}
          placeholder="Title..."
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          onSubmitEditing={Keyboard.dismiss}
        />

        <TextInput
          style={styles.contentInput}
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
        />

        <TouchableOpacity style={styles.saveButton} onPress={Keyboard.dismiss}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inner: { padding: 16, flexGrow: 1 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, marginTop: 48 },
  titleInput: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 12 },
  contentInput: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, height: 300, textAlignVertical: 'top', marginBottom: 12 },
  saveButton: { backgroundColor: '#4F86F7', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 32 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});