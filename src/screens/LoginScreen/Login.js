import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import getRealm from '../../services/realm';
import api from '../../services/api';
import NetInfo from '@react-native-community/netinfo';
import styles from './styles';
import {Loader} from '../../components/Loader';

export default function Login({navigation, route}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [visibleLoader, setVisibleLoader] = useState(false);
  const [internet, setInternet] = useState(null);
  const [offset] = useState(new Animated.ValueXY({x: 0, y: 80}));
  const [opacity] = useState(new Animated.Value(0));

  const dispatch = useDispatch();
  //ao iniciar a aplicação fará a validação se a chave registrada no storage é igual a do banco de dados, caso seja entrará na
  //aplicação, caso não solicitará que faça o login
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
    //consulta no storage
    connectivity();
    getUsuario();
  },[]);

   function connectivity() {
    if (Platform.OS === 'android') {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          setInternet(true);
        } else {
          Alert.alert('Desconectado', 'Você está desconectado a internet');
          setInternet(false);
        }
      });
    }
  }

  function acessar() {
    getUsuario();
  }
  async function clearStore() {
    const realm = await getRealm();
    const store = realm.objects('User');

    let object = realm.objectForPrimaryKey('User', store[0].id);
    realm.write(() => {
      realm.delete(object);
    });
  }
  async function getUsuario() {
    try {
      setVisibleLoader(true);
      if (internet == true) {
        const response2 = await api.get(
          `/acessoapp?method=loadAll&usuarioApp=${email}&senhaApp=${senha}`,
        );
        const user = response2.data.data[0];

        const realm = await getRealm();
        const store = realm.objects('User');

        if (store[0] != undefined) {
          //Logado
          if (store[0]?.logado == true) {
            if (
              user.email == store[0].email &&
              user.senha == store[0].senha &&
              user.token == store[0].token
            ) {
              
              navigation.replace('CollectList');
            } else {
              clearStore();
            }
          } //Deslogado
          else {
            if (user) {
              clearStore();
              setUser(user);
              navigation.replace('CollectList');
            } else {
              Alert.alert(
                'Email e Senha incorretos',
                'Verifique o email e senha digitados',
              );
            }
          }
        }else {
          if(user){
           await setUser(user)
            navigation.replace('CollectList');

          }
        } //Sem internet
      } else {
        const realm = await getRealm();
        const store = realm.objects('User');
        if(store[0]){
          if (store[0]?.logado == true) {
            navigation.replace('CollectList');
          } else {
            Alert.alert('Erro ao conectar', 'Esteja conectado a internet para fazer login')
          }
        }
      }
    } catch (error) {
      setVisibleLoader(false);
      console.log(error);
    } finally {
      setVisibleLoader(false);
    }
  }

  async function setUser(usuario) {
    if (usuario.length != 0) {
      const realm = await getRealm();

      realm.write(() => {
        realm.create('User', {
          id: parseInt(usuario.id),
          nome: usuario.nome,
          email: usuario.login,
          senha: usuario.senha,
          token: usuario.chave,
          logado: true,
          system_user_id: usuario.system_user_id,
          system_unit_id: usuario.system_unit_id,
        });
      });
      dispatch({
        type: 'USER_LOGGED_IN',
        payload: [
          usuario.nome,
          usuario.login,
          usuario.senha,
          usuario.chave,
          usuario.system_user_id,
          usuario.system_unit_id,
        ],
      });
      setEmail('');
      setSenha('');
    }
    navigation.replace('CollectList');
  }

  return (
    <>
      <KeyboardAvoidingView style={styles.background}>
        <View style={styles.containerLogo}>
          <Image
            style={{
              width: Dimensions.get('window').width/2.5,
              height: Dimensions.get('window').width/2.5,
              borderRadius: 10,
            }}
            source={require('../../../assets/icon2.png')}
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

          <TouchableOpacity style={styles.btnSubmit} onPress={() => acessar()}>
            <Text style={styles.submitText}>Acessar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSolicit}>
            <Text style={styles.solicitText}>Solicitar criação de conta</Text>
          </TouchableOpacity>
        </Animated.View>
        {visibleLoader && <Loader />}
      </KeyboardAvoidingView>
    </>
  );
}
