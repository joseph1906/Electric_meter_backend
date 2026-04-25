import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in and scale animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Start spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate to LoginForm after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/LoginForm');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Interpolate spin value for rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>⚡ Electric Meter</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Welcome</Text>
        
        {/* Spinning loader */}
        <Animated.View style={[styles.loaderContainer, { transform: [{ rotate: spin }] }]}>
          <View style={styles.loader} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#1B1A31",
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#fff",
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#D9D9D9",
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: "#D9D9D9",
    marginVertical: 20,
    borderRadius: 2,
  },
  loaderContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#D9D9D9',
    borderTopColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
});