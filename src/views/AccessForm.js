import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { FIRESTORE_DB } from '../consts/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import COLORS from '../consts/colors';
import { PrimaryButton } from './components/Button';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const AccessForm = (props) => {

    const agregarUsuarioNoAutorizado = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        // Verifica si el usuario está autenticado
        if (user) {
          // Obtiene el uid del usuario
          const uid = user.uid;
          
          // Agrega el uid al documento en Firebase
          addDoc(collection(FIRESTORE_DB, 'UsersNotAuthorizedAccess'), {
            uid: uid,
            correo: correo,
            primerNombre: primerNombre,
            segundoNombre: segundoNombre,
            primerApellido: primerApellido,
            segundoApellido: segundoApellido,
            rut: rutValido,
          })
          Alert.alert('Registro enviado');
        } else {
          // El usuario no está autenticado, maneja el caso según tus necesidades
          Alert.alert('Usuario no autenticado');
        }
      };

    const datosObligatorios = async () => {
        if (!correo || !primerNombre || !segundoNombre || !primerApellido || !segundoApellido || !rut) {
            Alert.alert('Faltan datos', 'Por favor complete los campos obligatorios');
        } else {
            agregarUsuarioNoAutorizado()
            handleVolver();
        }
    }

    const [correo, setCorreo] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [rut, setRut] = useState('');
    const [rutValido, setRutValido] = useState('');
    const navigation = useNavigation();

    const limpiarTexto = (textoIngresado, setTexto) => {
        const textoLimpio = textoIngresado.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '');
        setTexto(textoLimpio);
    };

    const handleVolver = () => {
        navigation.goBack();
    };


    //--------------------------------------------------RUT-----------------------------------------
    const verificarRut = (rutValido, setRutValido) => {
        // Remover guiones y puntos del Rut
        const rutLimpio = rutValido.replace(/[^0-9Kk]/g, '');

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
            setRutValido(rutSinDigito);
        } else {
            console.log('Error', 'El Rut ingresado es incorrecto');
            setRutValido(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar backgroundColor="black" />

                <Image
                    style={styles.image}
                    source={require('../assets/logo_SS.png')}
                />
                <Text style={styles.Titulo}>Registre nuevo usuario</Text>

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
                />{primerNombre ? (
                    <Text style={styles.campoIngresado}>Campo ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Ingrese segundo nombre</Text>
                <TextInput
                    value={segundoNombre}
                    onChangeText={(text) => limpiarTexto(text, setSegundoNombre)}
                    placeholder="Segundo nombre"
                    maxLength={15}
                    style={styles.textInput}
                />{segundoNombre ? (
                    <Text style={styles.campoIngresado}>Campo ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Ingrese primer apellido</Text>
                <TextInput
                    value={primerApellido}
                    onChangeText={(text) => limpiarTexto(text, setPrimerApellido)}
                    placeholder="Primer apellido"
                    maxLength={15}
                    style={styles.textInput}
                />{primerApellido ? (
                    <Text style={styles.campoIngresado}>Campo ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Ingrese segundo apellido</Text>
                <TextInput
                    value={segundoApellido}
                    onChangeText={(text) => limpiarTexto(text, setSegundoApellido)}
                    placeholder="Segundo apellido"
                    maxLength={15}
                    style={styles.textInput}
                />{segundoApellido ? (
                    <Text style={styles.campoIngresado}>Campo ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Ingrese rut</Text>
                <TextInput
                    value={rut}
                    onChangeText={setRut}
                    onBlur={() => verificarRut(rut, setRutValido)}
                    maxLength={9}
                    keyboardType='numeric'
                    placeholder="Rut sin puntos ni guion"
                    style={styles.textInput}
                />
                {rutValido ? (
                    <Text style={{ color: 'green', alignSelf: 'center' }}>Rut válido</Text>
                ) : (
                    <Text style={{ color: 'red', alignSelf: 'center' }}>Rut incorrecto</Text>
                )}

                <Text style={styles.subTitulo}>Ingrese correo</Text>
                <TextInput
                    value={correo}
                    onChangeText={setCorreo}
                    placeholder="correo"
                    maxLength={20}
                    style={styles.textInput}
                />{correo ? (
                    <Text style={styles.campoIngresado}>Campo ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo obligatorio</Text>
                )}

                <View style={styles.Buttons}>
                    <PrimaryButton
                        title="Guardar"
                        color="blue"
                        onPress={() => datosObligatorios()} />
                </View>
            </ScrollView>
        </View>
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
        marginTop: 15,
        color: '#1e6496',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 20,
    },
    categoria: {
        marginTop: 15,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    subTitulo: {
        flex: 1,
        marginTop: 15,
        height: 35,
        borderRadius: 10,
        flexDirection: 'row',
        fontSize: 15,
        paddingHorizontal: 20,
    },
    opcional: {
        marginTop: 10,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    campoObligatorio: {
        color: 'red',
    },
    campoIngresado: {
        color: 'green'
    },
    textInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
        borderRadius: 10,
        flexDirection: 'row',
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    Buttons: {
        fontSize: 13,
    },
    time: {
        fontSize: 20,
        marginTop: 16,
    },

    multiSelect: {
        height: 50,
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        borderRadius: 10,
        backgroundColor: COLORS.white,
        /* justifyContent: 'center',
        alignItems: 'center', */
    },
    descrip: {
        backgroundColor: 'white',
        alignSelf: 'center',
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        paddingStart: 10,
        paddingEnd: 10,
        width: '100%',
        height: 200,
        borderRadius: 30,
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 10,
    }
});

export default AccessForm