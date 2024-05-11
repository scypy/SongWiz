import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'

export default function TextInput({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={"#DC143C"}
        {...props}
      />
     
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: "#DC143C",
  },
  description: {
    fontSize: 13,
    color: "#DC143C",
    paddingTop: 8,
  },
  error:{
    color:"#DC143C",
    fontWeight:"bold",
    fontSize: 13,
    paddingTop: 18
  }
})