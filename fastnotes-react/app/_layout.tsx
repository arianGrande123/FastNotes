import { Session } from '@supabase/supabase-js'
import * as Notifications from 'expo-notifications'
import { Stack, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    registerForNotifications()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session)
      }
      if (event === 'SIGNED_OUT') {
        setSession(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!initialized) return
    if (session) {
      router.replace('/')
    } else {
      router.replace('/auth' as any)
    }
  }, [session, initialized])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="note/new" />
      <Stack.Screen name="note/[id]" />
      <Stack.Screen name="~" />
    </Stack>
  )
}

async function registerForNotifications() {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') {
  }
}