import React from 'react';
import Animated from 'react-native-reanimated';
import {Dimensions, StyleSheet, View, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {routes} from './LightboxExample';

const dimensions = Dimensions.get('window');

type ExampleImage = {
  id: number;
  uri: string;
  width: number;
  height: number;
};

export const images: ExampleImage[] = Array.from({length: 30}, (_, index) => {
  return {
    id: index + 1,
    uri: `https://picsum.photos/id/${index + 10}/400/400`,
    width: dimensions.width,
    height: 400,
  };
});

export function LightboxGalleryScreen(): React.ReactElement {
  const nav = useNavigation();

  return (
    <View style={[styles.container]}>
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={images}
        numColumns={4}
        columnWrapperStyle={styles.column}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => nav.navigate(routes.Lightbox, {item})}>
            <Animated.Image
              sharedTransitionTag={'image-' + item.id}
              source={{uri: item.uri}}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    gap: 4,
    justifyContent: 'center',
  },
  column: {
    gap: 4,
  },
  image: {
    width: dimensions.width / 4 - 3,
    height: dimensions.width / 4 - 3,
  },
});
