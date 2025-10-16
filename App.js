import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/database/firebaseconfig';

// Importar vistas
import Productos from "./src/views/Productos";
import Clientes from "./src/views/Clientes";
import Promedios from "./src/views/Promedios";
import Usuarios from "./src/views/Usuarios";

// Importar componentes
import Encabezado from "./src/components/Encabezado";
import Login from "./src/components/Login";

export default function App() {
  const [pantalla, setPantalla] = useState("productos");
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const verificarSesion = async () => {
      try {
        const sesionGuardada = await AsyncStorage.getItem('usuario');
        if (sesionGuardada) {
          setUsuario(JSON.parse(sesionGuardada));
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();

    // Observador de estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        AsyncStorage.setItem('usuario', JSON.stringify(user));
      } else {
        setUsuario(null);
        AsyncStorage.removeItem('usuario');
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const iniciarSesion = async (user) => {
    setUsuario(user);
    await AsyncStorage.setItem('usuario', JSON.stringify(user));
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('usuario');
      setUsuario(null);
      setPantalla("productos"); // Resetear a la pantalla inicial
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderPantalla = () => {
    switch (pantalla) {
      case "productos":
        return <Productos cerrarSesion={cerrarSesion} />;
      case "clientes":
        return <Clientes />;
      case "promedios":
        return <Promedios />;
      case "usuarios":
        return <Usuarios />;
      default:
        return <Productos cerrarSesion={cerrarSesion} />;
    }
  };

  // Mostrar pantalla de carga mientras verifica la sesión
  if (cargando) {
    return <View style={styles.container} />;
  }

  // Si no hay usuario autenticado, mostrar Login
  if (!usuario) {
    return <Login onLoginSuccess={iniciarSesion} />;
  }

  // Si hay usuario autenticado, mostrar la aplicación
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Encabezado
        titulo={
          pantalla === "productos"
            ? "Gestión de Productos"
            : pantalla === "clientes"
            ? "Gestión de Clientes"
            : pantalla === "usuarios"
            ? "Gestión de Usuarios"
            : "Promedios"
        }
      />

      {/* Menú de navegación */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.boton, pantalla === "productos" && styles.activo]}
          onPress={() => setPantalla("productos")}
        >
          <Text style={styles.textoBoton}>Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "clientes" && styles.activo]}
          onPress={() => setPantalla("clientes")}
        >
          <Text style={styles.textoBoton}>Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "promedios" && styles.activo]}
          onPress={() => setPantalla("promedios")}
        >
          <Text style={styles.textoBoton}>Promedios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "usuarios" && styles.activo]}
          onPress={() => setPantalla("usuarios")}
        >
          <Text style={styles.textoBoton}>Usuarios</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.contenido}>{renderPantalla()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5e5e5",
    paddingVertical: 10,
  },

  boton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  textoBoton: {
    fontSize: 14,
    color: "#333",
  },

  activo: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },

  contenido: {
    flex: 1,
  },
});