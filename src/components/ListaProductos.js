import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ListaProductos = ({ productos }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Productos</Text>
      <FlatList
        data={productos}  
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <Text style={styles.item}>
          {item.nombre} - ${item.precio}
        </Text>
        )}
      />
    </View>
  );
};
  const styles = StyleSheet.create({  
  container: {flex:1, justifyContent:"center"},
  titulo: {fontSize:22, fontWeight:"bold", marginBottom:5},
  item: {padding:5, marginBottom:5},
  });

export default ListaProductos;