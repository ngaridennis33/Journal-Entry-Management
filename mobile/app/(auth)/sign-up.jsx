import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from "../../constants"
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { Link } from 'expo-router'

const SignUp = () => {
    const [form, setForm] = useState({
        username:"",
        email: "",
        password: ""
    })

    const [isubmitting, setIsubmitting] = useState(false)

    const submit = ()=>{

    }

  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView >
            <View className="w-full justify-center min-h-[85vh] px-4 my-6">
                <Image
                source={images.logo}
                resizeMode='contain'
                className="w-[115px] h-[53px]"
                />
                <Text className="text-2xl text-white font-psemibold text-semibold mt-10">
                    Sign Up to Aora
                </Text>

                <FormField
                title="Username"
                value={form.username}
                handleChange={(e) => setForm({ ...form, username: e})}
                otherStyles="mt-10"
                />

                <FormField
                title="Email"
                value={form.email}
                handleChange={(e) => setForm({ ...form, email: e})}
                otherStyles="mt-7"
                keybordType="email-address"
                />

                <FormField
                title="Password"
                value={form.password}
                handleChange={(e) => setForm({ ...form, password: e})}
                otherStyles="mt-7"
                />

                <CustomButton 
                title="Sign Up"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isubmitting}
                />

                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg text-gray-100 font-pregular">
                        Have an Account Already?
                    </Text>
                    <Link href="/sign-in" className='text-lg font-psemibold text-secondary'> Sign in</Link>

                </View>

            </View>

        </ScrollView>

    </SafeAreaView>
  )
}

export default SignUp