import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, StatusBar, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';

import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../consts/firebase';
import { getAuth } from 'firebase/auth';
const HomeScreen = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const obtenerNombreUsuario = async () => {
      const auth = getAuth(); // Obtén la instancia de autenticación de Firebase
      const user = auth.currentUser; // Obtén el usuario actual

      if (user) {
        const userId = user.uid; // Obtén el UID del usuario actual
        const userProfileQuery = query(collection(FIRESTORE_DB, 'UserProfiles'), where('uid', '==', userId));
        const querySnapshot = await getDocs(userProfileQuery);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const nombreUsuario = userData.nombre; // Obtén el campo que contiene el nombre del usuario
          const primeraPalabra = nombreUsuario.split(' ')[0];
          setUserName(primeraPalabra);
          console.log(nombreUsuario);
        });
      }
    };

    obtenerNombreUsuario();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.li }}>
      <View style={styles.header}>
        <StatusBar backgroundColor="black" />
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 28 }}>Hola,</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 10 }}>{userName}</Text>
          </View>
          <Text style={{ marginTop: 5, fontSize: 22, color: COLORS.grey }}>¿Necesitas ayuda?</Text>
        </View>
        <Image
          source={require('../assets/person.png')}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
      </View>
      <View style={{ marginTop: 40, flexDirection: 'row', paddingHorizontal: 20 }}>
        <View style={styles.inputContainer}>
          <Icon name="search" size={28} />
          <TextInput style={{ flex: 1, fontSize: 18 }} placeholder="Buscas ..." />
        </View>
        <View style={styles.sortBtn}>
          <Icon name="tune" size={28} color={COLORS.white} />
        </View>
      </View>
      <View>
        <Image
          source={require('../assets/fondo.jpg')}
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            height: 450,
            width: 400,
            borderRadius: 15,
            justifyContent: 'center'
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 120,
    margiderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
