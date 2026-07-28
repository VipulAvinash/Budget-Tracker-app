import { useAuth } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const TAB_SCREENS: { name: string; title: string; icon: IconName; iconSize?: number }[] = [
  { name: 'index', title: 'Stats', icon: 'stats-chart' },
  { name: 'add', title: 'Add', icon: 'add-circle', iconSize: 24 },
  { name: 'expense', title: 'Expense', icon: 'card' },
  { name: 'profile', title: 'Profile', icon: 'person' },
]

const TAB_SCREEN_OPTIONS: React.ComponentProps<typeof Tabs>['screenOptions'] = {
  headerShown: false,
  tabBarActiveTintColor: '#584de8',
  tabBarInactiveTintColor: '#9a96aa',
  tabBarStyle: {
    position: 'absolute', bottom: 20, left: 20, right: 20, height: 64,
    backgroundColor: '#191b23', borderRadius: 32,
    borderWidth: 1, borderColor: '#282a32', paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
}

const TabLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href={'/(auth)/sign-in'} />

  return (
    <Tabs screenOptions={TAB_SCREEN_OPTIONS}>
      {TAB_SCREENS.map(({ name, title, icon, iconSize = 22 }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? icon : (`${icon}-outline` as IconName)}
                size={iconSize}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}

export default TabLayout