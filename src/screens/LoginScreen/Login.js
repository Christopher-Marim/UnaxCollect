/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import getRealm from '../../services/realm';
import api from '../../services/api';
import styles from './styles';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setusuario] = useState();
  const [offset] = useState(new Animated.ValueXY({x: 0, y: 80}));
  const [opacity] = useState(new Animated.Value(0));

  const dispatch = useDispatch();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    async function loadUser() {
      const realm = await getRealm();

      const data = realm.objects('User');

      if (data.nome) {
        dispatch({
          type: 'USER_LOGGED_IN',
          payload: [data.nome, data.email, data.senha, data.token],
        });
        navigation.navigate('CollectList');
      }
    }

    loadUser();
  }, []);

  async function acessar() {
    dispatch({
      type: 'USER_LOGGED_IN',
      payload: [usuario.nome, usuario.email, usuario.senha, usuario.token],
    });
    getUsuario()
    await setUser();
    
    navigation.navigate('CollectList');

  }

  async function getUsuario() {
    try {
      
      const response = await api.get("/usuarios");

     let indexUsuario= response.data.findIndex((x)=>x.email == email)

     setusuario(response.data[indexUsuario])

    } catch (error) {
      Alert.alert("Informações inválidas","Verificar email e senha")
    }
  }

  async function setUser() {
    if(usuario.length!=0){
      const realm = await getRealm();
  
      realm.write(() => {
        realm.create('User', {
          id: Math.random() * 1000,
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          token: usuario.token,
        });
      });
      setEmail('');
    setSenha('');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image
          style={{
            width: 170,
            height: 170,
            borderRadius:10
          }}
          source={require('../../../assets/icon.png')}
        />
      </View>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacity,
            transform: [{translateY: offset.y}],
          },
        ]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
          keyboardType={'email-address'}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCorrect={false}
          value={senha}
          onChangeText={(text) => setSenha(text)}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.btnSubmit} onPress={() => ({/*acessar()*/}, navigation.navigate('CollectList'))}>
          <Text style={styles.submitText}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSolicit}>
          <Text style={styles.solicitText}>Solicitar criação de conta</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
