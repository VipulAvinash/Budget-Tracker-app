import React, { useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuth, useUser } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import SafeAreaView from '@/components/SafeAreaView'
import { useExpenseStore } from '@/store/useExpenseStore'
import { formatCurrency } from '@/lib/app.helpers'

const ProfileScreen = () => {
  const { user } = useUser()
  const { signOut } = useAuth()
  const { userExpenses } = useExpenseStore()

  const totalSpent = userExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  // Personal details state (pre-filled with user data where available)
  const [phoneNumber, setPhoneNumber] = useState(
    user?.primaryPhoneNumber?.phoneNumber || '+91 98765 43210'
  )
  const [dob, setDob] = useState('15-08-1998')
  const [gender, setGender] = useState('Male')
  const [address, setAddress] = useState('Mumbai, Maharashtra, India')
  const [isEditing, setIsEditing] = useState(false)

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ])
  }

  const userAvatar = user?.imageUrl
  const userName = user?.fullName || user?.firstName || 'User'
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'No email provided'

  return (
    <SafeAreaView className="flex-1 bg-magnolia dark:bg-cinder px-5 pt-4" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-extrabold tracking-tight text-ebony dark:text-athens-gray">
            Profile
          </Text>
          <Text className="mt-1 text-sm text-gun-powder/70 dark:text-gray-suit">
            Manage your personal profile and account details
          </Text>
        </View>

        {/* User Card */}
        <View className="bg-white dark:bg-shark2 p-6 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-6 items-center">
          {userAvatar ? (
            <Image
              source={{ uri: userAvatar }}
              className="w-24 h-24 rounded-full mb-3 border-2 border-[#584de8]"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-[#584de8]/10 border-2 border-[#584de8] items-center justify-center mb-3">
              <Text className="text-3xl font-black text-[#584de8]">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <Text className="text-xl font-extrabold text-ebony dark:text-athens-gray">
            {userName}
          </Text>
          <Text className="text-xs text-gun-powder/70 dark:text-gray-suit font-medium mt-1">
            {userEmail}
          </Text>

          <View className="mt-4 px-3 py-1 bg-purple-500/10 rounded-full">
            <Text className="text-xs font-bold text-[#584de8]">Active Member</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white dark:bg-shark2 p-4 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm">
            <View className="w-9 h-9 rounded-xl bg-purple-500/10 items-center justify-center mb-2">
              <Ionicons name="receipt-outline" size={18} color="#584de8" />
            </View>
            <Text className="text-xs font-medium text-gun-powder/70 dark:text-gray-suit">
              Total Logged
            </Text>
            <Text className="text-lg font-bold text-ebony dark:text-athens-gray mt-0.5">
              {userExpenses.length} Items
            </Text>
          </View>

          <View className="flex-1 bg-white dark:bg-shark2 p-4 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm">
            <View className="w-9 h-9 rounded-xl bg-emerald-500/10 items-center justify-center mb-2">
              <Ionicons name="cash-outline" size={18} color="#10b981" />
            </View>
            <Text className="text-xs font-medium text-gun-powder/70 dark:text-gray-suit">
              Lifetime Total
            </Text>
            <Text className="text-lg font-bold text-ebony dark:text-athens-gray mt-0.5" numberOfLines={1}>
              {formatCurrency(totalSpent)}
            </Text>
          </View>
        </View>

        {/* Personal Details Section */}
        <View className="bg-white dark:bg-shark2 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-6 p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase tracking-wider">
              Personal Details
            </Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text className="text-xs font-bold text-[#584de8]">
                {isEditing ? 'Done' : 'Edit Details'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Gender */}
          <View className="py-3 border-b border-titan-white/10 dark:border-shark3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Ionicons name="person-outline" size={20} color="#584de8" />
              <Text className="text-sm font-semibold text-ebony dark:text-athens-gray">
                Gender
              </Text>
            </View>
            {isEditing ? (
              <TextInput
                value={gender}
                onChangeText={setGender}
                className="text-xs font-bold text-[#584de8] bg-titan-white/30 dark:bg-shark3 px-3 py-1 rounded-xl text-right"
              />
            ) : (
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit">
                {gender}
              </Text>
            )}
          </View>

          {/* Date of Birth (DOB) */}
          <View className="py-3 border-b border-titan-white/10 dark:border-shark3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Ionicons name="calendar-outline" size={20} color="#584de8" />
              <Text className="text-sm font-semibold text-ebony dark:text-athens-gray">
                Date of Birth (DOB)
              </Text>
            </View>
            {isEditing ? (
              <TextInput
                value={dob}
                onChangeText={setDob}
                placeholder="DD-MM-YYYY"
                className="text-xs font-bold text-[#584de8] bg-titan-white/30 dark:bg-shark3 px-3 py-1 rounded-xl text-right"
              />
            ) : (
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit">
                {dob}
              </Text>
            )}
          </View>

          {/* Phone Number */}
          <View className="py-3 border-b border-titan-white/10 dark:border-shark3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Ionicons name="call-outline" size={20} color="#584de8" />
              <Text className="text-sm font-semibold text-ebony dark:text-athens-gray">
                Phone Number
              </Text>
            </View>
            {isEditing ? (
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                className="text-xs font-bold text-[#584de8] bg-titan-white/30 dark:bg-shark3 px-3 py-1 rounded-xl text-right"
              />
            ) : (
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit">
                {phoneNumber}
              </Text>
            )}
          </View>

          {/* Address */}
          <View className="py-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <Ionicons name="location-outline" size={20} color="#584de8" />
              <Text className="text-sm font-semibold text-ebony dark:text-athens-gray">
                Address
              </Text>
            </View>
            {isEditing ? (
              <TextInput
                value={address}
                onChangeText={setAddress}
                className="text-xs font-bold text-[#584de8] bg-titan-white/30 dark:bg-shark3 px-3 py-1 rounded-xl flex-1 text-right"
              />
            ) : (
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit text-right flex-1" numberOfLines={1}>
                {address}
              </Text>
            )}
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="bg-red-500/10 border border-red-500/30 py-4 rounded-3xl items-center justify-center flex-row gap-2"
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold text-base">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen