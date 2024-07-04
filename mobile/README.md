# React Native-Expo Journal Management Mobile App

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets](#snippets)
6. 🔗 [Links](#links)

# Introduction
Built with React Native for seamless user experiences, Expo for effortless development, Nativewind for beautiful styling, and Tailwind CSS for robust code, this app showcases impressive design and functionality, enabling smooth and intuitive journaling on the go.


## <a name="tech-stack">⚙️ Tech Stack</a>

- React Native
- Expo
- Nativewind
- Tailwind
- Animatable

## <a name="features">🔋 Features</a>

👉 **Onboarding Screen**: Attractive graphics and straightforward instructions introduce users to the app.

👉 **Secure Authentication System**: Protect user accounts with secure email login using JWT.

👉 **Pull-to-Refresh**: Update content effortlessly with a simple pull gesture.

👉 **Advanced Search**: Quickly find journals with full-text search, real-time suggestions, and instant results.

👉 **Tab Navigation**: Effortlessly switch between Home, Journal Creation, and Profile sections with intuitive tab navigation.

👉 **Journal Creation Screen for Uploading Media**: Easily create and upload journals with media content.

👉 **Profile Screen with user info**: View and update user information seamlessly.

👉 **Responsive Design**: Ensure smooth performance and consistent experience across different devices and screen sizes.

👉 **Engaging Animations:**: Dynamic animations using the Animatable library to enhance user interaction and engagement throughout the app's UI.

Plus, many more features, including scalable code architecture and reusability.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

## Create the project
```npx create-expo-app@latest [your-app-name] --template    blank@latest ```

### Navigate into your app
``` cd <your-app-name>```

## Dependancies
- Install the dependancies

``` npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar ```

### Setup entry point 
For the property main, use the expo-router/entry as its value in the package.json. The initial client file is app/_layout.js.

```javascript
// package.json

{
  "main": "expo-router/entry"
} 
```

### Modify project configuration
- Add a deep linking scheme in your app config:
app.json ``` "scheme": "your-app-scheme" ```

### Install Native wind for styling and dev dependacies for Tailwind css
- tailwindcss is not used during runtime so it can be added as a development dependency.

``` npm install nativewind 
    npm install --save-dev tailwindcss@3.3.2
```

### Setup Tailwind CSS
Run ``` npx tailwindcss init ``` to create a tailwind.config.js file

- Add the paths to all of your component files in your tailwind.config.js file. Remember to replace <custom directory> with the actual name of your directory e.g. screens.

```javascript
// tailwind.config.js

module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Add the babel plugin

* Modify your babel.config.js

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
+   plugins: ["nativewind/babel"],
  };
};
```

### Clear bundler cache 
- run the following command to clear the bundler cache and start the app.
``` npx expo start -c ```

**Expo Go**

Download the [Expo Go](https://expo.dev/go) app onto your device, then use it to scan the QR code from Terminal and run.

## <a name="snippets">🕸️ Snippets</a>
- Fonts and color theme used in the app
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## <a name="links">🔗 Links</a>

Figma design used in this project: https://www.figma.com/design/yFV3zEmrWeYNjCSuXm8HlK/Journal?node-id=0-1&t=KVQrlFHuhlOgcOkq-0