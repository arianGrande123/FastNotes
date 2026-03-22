import { router } from 'expo-router'
import { useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { supabase } from '../../lib/supabase'

export default function NewNoteScreen() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('notes').insert({
      title: title.trim(),
      content: content.trim(),
      user_id: user?.id,
      updated_at: new Date().toISOString(),
    })

    if (error) Alert.alert('Feil', error.message)
    else {
      Alert.alert('Suksess!', 'Notatet ble lagret')
      router.back()
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Tilbake</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nytt notat</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Lagrer...' : 'Lagre'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <TextInput
          style={styles.titleInput}
          placeholder="Tittel"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Skriv notatet ditt her..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  backText: { color: '#2563eb', fontSize: 14 },
  saveText: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
  form: { padding: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
  },
})