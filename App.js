import { StatusBar } from 'expo-status-bar';
import { useEffect ,useState} from 'react';
import { StyleSheet, Text, TouchableOpacity,Button,Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import AddStudent from './screens/AddStudent';
export default function App() {
  const Stack = createNativeStackNavigator()
   return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddStudent" component={AddStudent} />
      </Stack.Navigator>
    </NavigationContainer>
   )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
