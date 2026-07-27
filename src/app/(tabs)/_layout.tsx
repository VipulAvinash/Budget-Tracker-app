import { useAuth } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'

const TabLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null

  if (!isSignedIn)
    return <Redirect href={"/(auth)/sign-in"} />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#584de8",
        tabBarInactiveTintColor: "#9a96aa",
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "#191b23",
          borderRadius: 32,
          height: 64,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "#282a32",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 10,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: "Expense",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "card" : "card-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout