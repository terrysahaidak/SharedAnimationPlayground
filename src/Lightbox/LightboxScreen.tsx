import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {
  Easing,
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  SharedTransition,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const timingConfig = {
  duration: 240,
  easing: Easing.bezierFn(0.33, 0.01, 0, 1),
};

export const lightboxTransition = SharedTransition.custom(values => {
  'worklet';
  return {
    width: withTiming(values.targetWidth, timingConfig),
    height: withTiming(values.targetHeight, timingConfig),
    originX: withTiming(values.targetOriginX, timingConfig),
    originY: withTiming(values.targetOriginY, timingConfig),
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

  type AnimatedGHContext = {
    startX: number;
    startY: number;
  };
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      ctx.startX = translation.x.value;
      ctx.startY = translation.y.value;
    },
    onActive: (event, ctx) => {
      translation.x.value = ctx.startX + event.translationX;
      translation.y.value = ctx.startY + event.translationY;
      translation.scale.value = interpolate(
        translation.y.value,
        [-200, 0, 200],
        [0.65, 1, 0.65],
        Extrapolate.CLAMP,
      );
    },
    onEnd: _ => {
      if (Math.abs(translation.x.value) + Math.abs(translation.y.value) > 150) {
        runOnJS(goBack)();
      } else {
        translation.x.value = withTiming(0);
        translation.y.value = withTiming(0);
        translation.scale.value = withTiming(1);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translation.x.value},
      {translateY: translation.y.value},
      {scale: translation.scale.value},
    ],
    width: activeItem.width,
    height: activeItem.height,
  }));

  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200).delay(0)}
        style={StyleSheet.absoluteFill}>
        <Pressable style={styles.backdrop} onPress={goBack} />
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.Image
          sharedTransitionStyle={lightboxTransition}
          source={{uri: activeItem.uri}}
          style={[animatedStyle]}
          sharedTransitionTag={'image-' + activeItem.id}
        />
      </PanGestureHandler>

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

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
