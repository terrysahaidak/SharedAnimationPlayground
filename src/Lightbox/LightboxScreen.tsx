import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SharedTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Pressable, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const springOptions = {
  damping: 15,
};

export const lightboxTransition = SharedTransition.custom(values => {
  'worklet';
  return {
    width: withSpring(values.targetWidth, springOptions),
    height: withSpring(values.targetHeight, springOptions),
    originX: withSpring(values.targetOriginX, springOptions),
    originY: withSpring(values.targetOriginY, springOptions),
  };
});

export function LightboxScreen() {
  const nav = useNavigation();
  const route = useRoute();

  const activeItem = route.params.item;

  const goBack = () => {
    nav.goBack();
  };

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
    scale: useSharedValue(1),
  };

  const panGeture = Gesture.Pan()
    .onChange(event => {
      translation.x.value += event.changeX;
      translation.y.value += event.changeY;
    })
    .onEnd(() => {
      if (Math.abs(translation.x.value) + Math.abs(translation.y.value) > 150) {
        runOnJS(goBack)();
      } else {
        translation.x.value = withTiming(0);
        translation.y.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translation.x.value},
      {translateY: translation.y.value},
      {
        scale:
          1 -
          (Math.abs(translation.x.value) + Math.abs(translation.y.value)) /
            1000,
      },
    ],
  }));

  const opacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity:
      1 - (Math.abs(translation.x.value) + Math.abs(translation.y.value)) / 100,
  }));

  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[StyleSheet.absoluteFill, opacityAnimatedStyle]}>
        <Pressable style={styles.backdrop} onPress={goBack} />
      </Animated.View>

      <GestureDetector gesture={panGeture}>
        <Animated.View style={[animatedStyle, styles.imageContainer]}>
          <Animated.Image
            source={{uri: activeItem.uri}}
            style={{
              width: activeItem.width,
              height: activeItem.height,
            }}
            sharedTransitionTag={'image-' + activeItem.id}
          />
        </Animated.View>
      </GestureDetector>

      <Animated.Text
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.backButton}
        onPress={goBack}>
        Back
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 10,
    fontSize: 16,
    color: 'white',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
