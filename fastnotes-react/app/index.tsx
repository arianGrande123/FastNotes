import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { supabase } from '../lib/supabase'

type Note = {
  id: string
  title: string
  content: string
  user_id: string
  updated_at: string
  image_url: string | null
}

const PAGE_SIZE = 5

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useFocusEffect(
    useCallback(() => {
      fetchNotes()
    }, [])
  )

  const fetchNotes = async () => {
    setLoading(true)
    setHasMore(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .range(0, PAGE_SIZE - 1)

    if (error) Alert.alert('Feil', error.message)
    else {
      setNotes(data || [])
      setHasMore((data || []).length === PAGE_SIZE)
    }
    setLoading(false)
  }

  const fetchMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .range(notes.length, notes.length + PAGE_SIZE - 1)

    if (error) Alert.alert('Feil', error.message)
    else {
      setNotes(prev => [...prev, ...(data || [])])
      setHasMore((data || []).length === PAGE_SIZE)
    }
    setLoadingMore(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleDelete = async (id: string) => {
    Alert.alert('Slett notat', 'Er du sikker på at du vil slette dette notatet?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Slett',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('notes').delete().eq('id', id)
          if (error) Alert.alert('Feil', error.message)
          else {
            Alert.alert('Suksess!', 'Notatet ble slettet')
            fetchNotes()
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jobb Notater</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logg ut</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : notes.length === 0 ? (
        <Text style={styles.emptyText}>Ingen notater ennå. Trykk + for å lage ett!</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.noteCard}
              onPress={() => router.push(('/note/' + item.id) as any)}
              onLongPress={() => handleDelete(item.id)}
            >
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.noteImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.notePreview} numberOfLines={2}>
                  {item.content}
                </Text>
                <Text style={styles.noteDate}>
                  {new Date(item.updated_at).toLocaleDateString('no-NO')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={fetchMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loadMoreText}>Last mer</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.noMoreText}>Ingen flere notater</Text>
            )
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/note/new' as any)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#666', fontSize: 16 },
  noteCard: {
    backgroundColor: '#fff',
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  noteContent: { padding: 16 },
  noteTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  notePreview: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  noteDate: { fontSize: 12, color: '#999', marginTop: 8 },
  loadMoreButton: {
    backgroundColor: '#2563eb',
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  loadMoreText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  noMoreText: { textAlign: 'center', color: '#999', fontSize: 14, padding: 16, marginBottom: 80 },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300' },
})