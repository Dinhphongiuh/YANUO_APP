import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  return (
   <SafeAreaView style={styles.container}>
    <Text>Contact Screen</Text>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  }
});
