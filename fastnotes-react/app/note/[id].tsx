import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  Image,
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

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) Alert.alert('Feil', error.message)
    else {
      setTitle(data.title)
      setContent(data.content)
      setImageUrl(data.image_url ?? null)
    }
    setLoading(false)
  }

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme')
      return
    }

    setSaving(true)
    const { error } = await supabase
      .from('notes')
      .update({
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) Alert.alert('Feil', error.message)
    else {
      Alert.alert('Suksess!', 'Notatet ble oppdatert')
      router.back()
    }
    setSaving(false)
  }

  if (loading) return <Text style={{ marginTop: 100, textAlign: 'center' }}>Laster...</Text>

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Tilbake</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rediger notat</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Lagrer...' : 'Lagre'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <TextInput
          style={styles.titleInput}
          placeholder="Tittel"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Innhold"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
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
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  backText: { color: '#2563eb', fontSize: 14 },
  saveText: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
  form: { flex: 1 },
  formContent: { padding: 16, paddingBottom: 40 },
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
    minHeight: 200,
    marginBottom: 24,
  },
  imageContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    aspectRatio: 4/3,
  },
})