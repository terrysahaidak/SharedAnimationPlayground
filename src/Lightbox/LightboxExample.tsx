import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LightboxGalleryScreen} from './LightboxGalleryScreen';
import {LightboxScreen} from './LightboxScreen';

const Stack = createNativeStackNavigator();

export const routes = {
  LightboxGallery: 'LightboxGallery',
  Lightbox: 'Lightbox',
};

export function LightboxGalleryExample() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: true}}>
        <Stack.Screen
          name={routes.LightboxGallery}
          component={LightboxGalleryScreen}
        />
        <Stack.Screen
          name={routes.Lightbox}
          options={{
            headerShown: false,
            animation: 'none',
            presentation: 'transparentModal',
          }}
          component={LightboxScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
