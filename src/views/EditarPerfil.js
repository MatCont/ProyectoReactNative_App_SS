import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, StatusBar, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { FIRESTORE_DB } from '../consts/firebase';
import { getFirestore, addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


import COLORS from '../consts/colors';
import { PrimaryButton } from './components/Button';

const EditarPerfil = () => {
  const [uid, setUid] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    obtenerUid();
  }, []);

  const subirPerfil = async () => {
    const nombre = primerNombre + ' ' + segundoNombre + ' ' + primerApellido + ' ' + segundoApellido;
    // Verificar si se ha obtenido el UID del usuario
    if (!uid) {
      Alert.alert('No se ha obtenido el UID del usuario');
      return;
    }

    // Verificar si el usuario ya tiene un perfil
    const db = getFirestore();
    const profileRef = doc(db, 'UserProfiles', uid);

    try {
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        // El usuario ya tiene un perfil, actualizar los datos existentes
        await updateDoc(profileRef, {
          nombreAfectado: nombre,
          genero: genero,
          rutAfectado: rutValido,
          fechaNacimiento: date,
          edad: edad,
          telefonoAfectado: telefono,
          correo: correo,
          domicilio: domicilio,
          mutualidad: mutual,
          estamentoAfectado: estamento,
          tipoEstamento: tipoEstamento,
        });

        Alert.alert('Perfil actualizado');
      } else {
        // El usuario no tiene un perfil, crear uno nuevo
        await setDoc(profileRef, {
          uid: uid,
          nombreAfectado: nombre,
          genero: genero,
          rutAfectado: rutValido,
          fechaNacimiento: date,
          edad: edad,
          telefonoAfectado: telefono,
          correo: correo,
          domicilio: domicilio,
          mutualidad: mutual,
          estamentoAfectado: estamento,
          tipoEstamento: tipoEstamento,
        });

        Alert.alert('Perfil creado');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error al subir el perfil');
    }
  };

  // Obtener el UID del usuario actual
  const obtenerUid = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid); // Guardar el UID en el estado
      }
    });
  };
  

  //-----------------------------------------------------
  const navigation = useNavigation();
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [genero, setGenero] = useState('');
  const [rut, setRut] = useState('');
  const [rutValido, setRutValido] = useState(''); //rut valido es el que se envia, no tiene dv
  const [date, setDate] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [mutual, setMutual] = useState('');
  const [estamento, setEstamento] = useState('');
  const [tipoEstamento, setTipoEstamento] = useState('');

  //-------------------------------------------Limpiar texto-----------------------------------------------  
  const limpiarTexto = (textoIngresado, setTexto) => {
    const textoLimpio = textoIngresado.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '');
    setTexto(textoLimpio);
  };

  //--------------------------------------------------FECHA-----------------------------------------
  const formatDate = (text) => {
    // Elimina todo lo que no sea dígito
    const cleaned = text.replace(/[^0-9]/g, '');

    // Divide en grupos de 2, 2 y 4 caracteres
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);

    if (match) {
      // Formatea la fecha con los separadores deseados
      const formatted = match[1] + '-' + match[2] + '-' + match[3];
      setDate(formatted);
      const edadCalculada = calcularEdad(formatted);
      setEdad(edadCalculada.toString());
    } else {
      setDate(cleaned);
    }
  };

  function calcularEdad(fecha) {
    const partesFecha = fecha.split('-');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10);
    const anio = parseInt(partesFecha[2], 10);

    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const anioActual = fechaActual.getFullYear();

    let edad = anioActual - anio;

    // Restar un año si el mes actual es anterior al mes de nacimiento
    if (mesActual < mes) {
      edad--;
    }
    // Restar un año si el mes actual es igual al mes de nacimiento pero el día actual es anterior al día de nacimiento
    else if (mesActual === mes && diaActual < dia) {
      edad--;
    }

    return edad;
  }
  //--------------------------------------------------NUMERO-----------------------------------------
  const clearNum = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setTelefono(cleaned)
  }
  //--------------------------------------------------RUT-----------------------------------------
  const verificarRut = (rut) => {
    // Remover guiones y puntos del Rut
    const rutLimpio = rut.replace(/[^0-9Kk]/g, '');

    // Obtener el número base y dígito verificador
    const rutRegExp = /^(\d+)([kK\d])$/;
    const rutSinDigito = rutLimpio.slice(0, -1);
    const match = rutLimpio.match(rutRegExp);

    if (!match) {
      // El Rut no cumple con el formato válido
      console.log('Error', 'El Rut ingresado no es válido');
      return;
    }

    const num = parseInt(match[1]);
    const dv = match[2].toUpperCase();

    // Calcular dígito verificador esperado
    let M = 0;
    let S = 1;
    let numRut = num; // Crear una nueva variable para almacenar el valor numérico del Rut
    for (; numRut; numRut = Math.floor(numRut / 10)) {
      S = (S + numRut % 10 * (9 - M++ % 6)) % 11;
    }

    const dvEsperado = S ? S - 1 + '' : 'K';

    // Comparar dígito verificador ingresado con el esperado
    if (dv === dvEsperado) {
      console.log('Éxito', 'El Rut ingresado es válido');
      setRutValido(rutLimpio);
      console.log('rut', rutLimpio);
    } else {
      console.log('Error', 'El Rut ingresado es incorrecto');
      console.log('rut', rutValido);
      setRutValido(false);
    }
  };
  //--------------------------------------------------Datos obligatorios-----------------------------------------
  const savePerfil = async () => {
    if (!primerNombre || !segundoNombre || !primerApellido || !segundoApellido || !rutValido || !date || !telefono || !correo || !domicilio || !mutual || !estamento || !tipoEstamento) {
      Alert.alert('Error', 'Por favor complete, todos los campos son obligatorios');
    } else {
      subirPerfil()
    }
  }

  const handleVolver = () => {
    navigation.goBack();
};
  //------------------------------------------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="black" />

      <Image
        style={styles.image}
        source={require('../assets/logo_SS.png')}
      />
      <Text style={{ fontSize: 23, color: "black", fontWeight: 'bold', alignSelf: 'center' }}>Datos Personales</Text>
      
          <TouchableOpacity style={styles.botonVolver} onPress={handleVolver}>
            <Icon name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>

          <Text style={styles.subTitulo}>Ingrese primer nombre</Text>
          <TextInput
            value={primerNombre}
            onChangeText={(text) => limpiarTexto(text, setPrimerNombre)}
            placeholder="Primer nombre"
            maxLength={15}
            keyboardType="ascii-capable"
            style={styles.textInput}
          />

          <Text style={styles.subTitulo}>Ingrese segundo nombre</Text>
          <TextInput
            value={segundoNombre}
            onChangeText={(text) => limpiarTexto(text, setSegundoNombre)}
            placeholder="Segundo nombre"
            maxLength={15}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Ingrese primer apellido</Text>
          <TextInput
            value={primerApellido}
            onChangeText={(text) => limpiarTexto(text, setPrimerApellido)}
            placeholder="Primer apellido"
            maxLength={15}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Ingrese segundo apellido</Text>
          <TextInput
            value={segundoApellido}
            onChangeText={(text) => limpiarTexto(text, setSegundoApellido)}
            placeholder="Segundo apellido"
            maxLength={15}
            style={styles.textInput}

          />

          <Text style={styles.subTitulo}>Ingrese genero</Text>
          <View style={styles.multiSelect}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue)}
            >
              <Picker.Item label="Seleccione" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
              <Picker.Item label="Sin informacion" value="Sin informacion" />
            </Picker>
          </View>

          <Text style={styles.subTitulo}>Ingrese rut</Text>
          <TextInput
            value={rut}
            onChangeText={setRut}
            onBlur={() => verificarRut(rut)}
            maxLength={12}
            placeholder="11.111.111-1"
            style={styles.textInput}
          />
          {rutValido ? (
            <Text style={{ color: 'green', alignSelf: 'center' }}>Rut válido</Text>
          ) : (
            <Text style={{ color: 'red', alignSelf: 'center' }}>Rut incorrecto</Text>
          )}

          <Text style={styles.subTitulo}>Ingrese fecha nacimiento</Text>
          <TextInput
            value={date}
            placeholder="dd mm yyyy"
            onChangeText={formatDate}
            maxLength={10}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Ingrese teléfono</Text>
          <TextInput
            value={telefono}
            onChangeText={clearNum}
            keyboardType='numeric'
            placeholder="111111111"
            maxLength={9}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Ingrese correo electrónico</Text>
          <TextInput
            value={correo}
            onChangeText={setCorreo}
            placeholder="...@gmail.com"
            maxLength={40}
            style={styles.textInput}
          />

          <Text style={styles.subTitulo}>Ingrese dirección</Text>
          <TextInput
            value={domicilio}
            onChangeText={setDomicilio}
            placeholder="Domicilio"
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Ingrese mutual</Text>
          <View style={styles.multiSelect}>
            <Picker
              selectedValue={mutual}
              onValueChange={(itemValue) => setMutual(itemValue)}
            >
              <Picker.Item label="Seleccione" value="" />
              <Picker.Item label="ISL" value="ISL" />
              <Picker.Item label="Mutual de seguridad" value="Mutual de seguridad" />
              <Picker.Item label="ACHS" value="ACHS" />
              <Picker.Item label="IST" value="IST" />
              <Picker.Item label="Sin mutualidad" value="Sin mutualidad" />
            </Picker>
          </View>
          <Text style={styles.subTitulo}>Ingrese estamento</Text>
          <View style={styles.multiSelect}>
            <Picker
              selectedValue={estamento}
              onValueChange={(itemValue) => setEstamento(itemValue)}
            >
              <Picker.Item label="Seleccione" value="" />
              <Picker.Item label="Auxiliar" value="Auxiliar" />
              <Picker.Item label="Administrativo" value="Administrativo" />
              <Picker.Item label="Tecnico" value="Tecnico" />
              <Picker.Item label="Tecnico superior" value="Tecnico superior" />
              <Picker.Item label="Profesional" value="Profesional" />
              <Picker.Item label="Medico" value="Medico" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>
          <Text style={styles.subTitulo}>Indique que estamento</Text>
          <TextInput
            value={tipoEstamento}
            onChangeText={setTipoEstamento}
            placeholder="Tipo de estamento"
            style={styles.textInput}
          />

          <View style={styles.Buttons2}>
            <PrimaryButton
              title="Guardar"
              color="blue"
              //onPress={() => subirPerfil()} />
              onPress={() => savePerfil()}/>
              
          </View>

    </ScrollView>
  )
}
//------------------------------------------------------------------------------------------
const styles = StyleSheet.create({

  container: {
    paddingVertical: 20,
    paddingHorizontal: 30,

    /* alignItems: 'center', */
  },

  Titulo: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },

  subTitulo: {
    flex: 1,
    marginTop: 10,
    height: 35,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },

  textInput: {
    flex: 1,
    height: 50,
    fontSize: 13,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonLayout: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10
  },
  Buttons: {
    fontSize: 12,
    height: 50,
    marginBottom: '15%',
  },
  Buttons2: {
    fontSize: 12,
    height: 50,
    marginBottom: '25%',
  },

  multiSelect: {
    fontSize: 13,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    /* justifyContent: 'center',
    alignItems: 'center', */
  },
  image: {
    width: 90,
    height: 90,
    alignSelf: 'center',

  }
})

export default EditarPerfil