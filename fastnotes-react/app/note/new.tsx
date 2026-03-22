import { useIsFocused } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
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
import { uploadImage, validateImage } from '../../lib/imageUtils'
import { supabase } from '../../lib/supabase'

export default function NewNoteScreen() {
  const isFocused = useIsFocused()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)

  const handlePickImage = async () => {
    if (!isFocused) return

    Alert.alert('Legg til bilde', 'Velg kilde', [
      {
        text: 'Ta bilde',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync()
          if (status !== 'granted') {
            Alert.alert('Feil', 'Du må gi tilgang til kameraet i innstillingene')
            return
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
          })
          if (!result.canceled) setImage(result.assets[0])
        },
      },
      {
        text: 'Velg fra galleri',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
          if (status !== 'granted') {
            Alert.alert('Feil', 'Du må gi tilgang til galleriet i innstillingene')
            return
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
          })
          if (!result.canceled) setImage(result.assets[0])
        },
      },
      { text: 'Avbryt', style: 'cancel' },
    ])
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      Alert.alert('Feil', 'Du er ikke logget inn')
      setLoading(false)
      return
    }

    let imageUrl: string | null = null

    if (image) {
      const mimeType = image.mimeType ?? 'image/jpeg'
      const fileSize = image.fileSize ?? 0
      const validationError = validateImage(fileSize, mimeType)

      if (validationError) {
        Alert.alert('Ugyldig bilde', validationError)
        setLoading(false)
        return
      }

      setUploading(true)
      imageUrl = await uploadImage(image.uri, mimeType)
      setUploading(false)

      if (!imageUrl) {
        setLoading(false)
        return
      }
    }

    const { error } = await supabase.from('notes').insert({
      title: title.trim(),
      content: content.trim(),
      user_id: user.id,
      updated_at: new Date().toISOString(),
      image_url: imageUrl,
    })

    if (error) Alert.alert('Feil', error.message)
    else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nytt notat: ' + title.trim(),
          body: 'Et nytt notat ble lagt til i Jobb Notater',
        },
       trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
      })
      Alert.alert('Suksess!', 'Notatet ble lagret')
      router.back()
    }

    setLoading(false)
  }

  const isBusy = loading || uploading

  if (!isFocused) return null

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isBusy}>
          <Text style={styles.backText}>← Tilbake</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nytt notat</Text>
        <TouchableOpacity onPress={handleSave} disabled={isBusy}>
          <Text style={[styles.saveText, isBusy && styles.saveTextDisabled]}>
            {isBusy ? 'Lagrer...' : 'Lagre'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <TextInput
          style={styles.titleInput}
          placeholder="Tittel"
          value={title}
          onChangeText={setTitle}
          editable={!isBusy}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Skriv notatet ditt her..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          editable={!isBusy}
        />

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: image.uri }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
            {!isBusy && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Text style={styles.removeImageText}>Fjern bilde</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.uploadingText}>Laster opp bilde...</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.imageButton, isBusy && styles.imageButtonDisabled]}
          onPress={handlePickImage}
          disabled={isBusy}
        >
          <Text style={styles.imageButtonText}>
            {image ? '📷 Bytt bilde' : '📷 Legg til bilde'}
          </Text>
        </TouchableOpacity>
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
  saveTextDisabled: { color: '#93c5fd' },
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
  imageButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  imageButtonDisabled: { borderColor: '#93c5fd' },
  imageButtonText: { color: '#2563eb', fontSize: 15 },
  imagePreviewContainer: { marginBottom: 12 },
  imagePreview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeImageButton: { alignItems: 'center' },
  removeImageText: { color: '#ef4444', fontSize: 14 },
  uploadingContainer: {
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  uploadingText: { color: '#2563eb', fontSize: 14 },
})