import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Image, Text, View, TouchableOpacity } from 'react-native';
import COLORS from '../consts/colors';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
//firebase
import { FIRESTORE_DB } from '../consts/firebase';
import { getDocs, collection } from 'firebase/firestore';

const VistaUsuarios = (props) => {
  const [lista, setLista] = useState([]);
  const [filtroRole, setFiltroRole] = useState(null);
  const [filtroRut, setFiltroRut] = useState(null);

  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'UsersAuthorizedAccess'));
        const docs = [];

        querySnapshot.forEach((doc) => {
          const { primerNombre, segundoNombre, primerApellido, segundoApellido, role, correo, rut } = doc.data();

          if ((!filtroRole || role === filtroRole) && (!filtroRut || rut === filtroRut)) {
            docs.push({
              id: doc.id,
              primerNombre,
              segundoNombre,
              primerApellido,
              segundoApellido,
              role,
              correo,
              rut,
            });
          }
        });
        setLista(docs);
      } catch (error) {
        // Manejo del error
      }
    };

    getLista();
  }, [filtroRole, filtroRut]);

  const handleFiltrarRole = (role) => {
    setFiltroRole(role);
  };

  const handleFiltrarRut = (rut) => {
    setFiltroRut(rut);
  };

  const handleMostrarTodos = () => {
    setFiltroRole(null);
    setFiltroRut(null);
  };

  const getCardBorderStyle = (role) => {
    if (role === 'usuario') {
      return { borderColor: 'black' };
    } else if (role === 'operador') {
      return { borderColor: 'blue', borderWidth: 2, };
    } else {
      return {};
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
      <Image style={styles.image} source={require('../assets/logo_SS.png')} />
      <Text style={styles.Titulo}>LISTA DE USUARIOS</Text>

      <View style={styles.filtros}>
        <TouchableOpacity
          style={styles.botonFiltro}
          onPress={handleMostrarTodos}
        >
          <Text style={styles.textoBoton}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonFiltro}
          onPress={() => handleFiltrarRole('usuario')}
        >
          <Text style={styles.textoBoton}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonFiltro}
          onPress={() => handleFiltrarRole('operador')}
        >
          <Text style={styles.textoBoton}>Operadores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonAdd}  onPress={() => props.navigation.navigate('NewUser')}>
          <Icon name="person-add" size={30} color={COLORS.dark} />
      </TouchableOpacity>
      </View>

      <TextInput
        style={styles.filterInput}
        placeholder="Filtrar por Rut"
        onChangeText={handleFiltrarRut}
        value={filtroRut}
      />

      <ScrollView>
        <View style={styles.container}>
          {lista.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => props.navigation.navigate('ShowUser', { usuarioId: item.id })}
            >
              <Card containerStyle={[styles.card, getCardBorderStyle(item.role)]}>
                <Card.Title>{item.role}</Card.Title>
                <Card.Divider />
                <Text>Nombre: {item.primerNombre} {item.primerApellido} {item.segundoApellido}</Text>
                <Text>Rut: {item.rut}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    height: 130,

  },
  filterInput: {
    height: '4%',
    borderWidth: 1,
    borderColor: COLORS.grey,
    paddingHorizontal: 10,
    marginLeft: '8%',
    marginBottom: 5,
    width: '84%',
  },
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    height: 120,
    width: 300,
    borderRadius: 10,

    borderColor: 'black',
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 10,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  Titulo: {
    
    color: '#1e6496',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  botonFiltro: {
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  textoBoton: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    border: 2,
    borderColor: 'black',
  },
  botonAdd:{
    width:30,
  },
});
export default VistaUsuarios;