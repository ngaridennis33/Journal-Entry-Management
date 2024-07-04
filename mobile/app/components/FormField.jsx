import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import {icons} from "../../constants"

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-gray-100 text-base font-pmedium">{title}</Text>

      <View className=" border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput 
        className="flex-1 text-white font-psemibold text-base"
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !setShowPassword}
        />
        {title === "Password" &&(
        <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
            <Image
            className="w-6 h-6"
            resizeMode='contain'
            source={!showPassword ? icons.eye: icons.eyeHide}
            />
        </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField