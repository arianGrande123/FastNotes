import { Alert } from 'react-native'
import { supabase } from './supabase'

const MAX_SIZE_BYTES = 15 * 1024 * 1024 // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateImage(fileSize: number, mimeType: string): string | null {
  if (fileSize > MAX_SIZE_BYTES) {
    return 'Bildet er for stort. Maks størrelse er 15MB.'
  }
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return 'Ugyldig format. Kun JPG, PNG og WebP er tillatt.'
  }
  return null
}

export async function uploadImage(uri: string, mimeType: string): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${mimeType.split('/')[1]}`

    const response = await fetch(uri)
    const blob = await response.blob()

    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })

    const { error } = await supabase.storage
      .from('note-images')
      .upload(fileName, arrayBuffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (error) {
      Alert.alert('Feil', 'Opplasting feilet: ' + error.message)
      return null
    }

    const { data } = supabase.storage
      .from('note-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  } catch {
    Alert.alert('Feil', 'Noe gikk galt under opplastingen')
    return null
  }
}