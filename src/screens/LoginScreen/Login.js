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
  Platform
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import getRealm from '../../services/realm';
import api from '../../services/api';
import NetInfo from '@react-native-community/netinfo'
import styles from './styles';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [Condition, setCondition] = useState(false);
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
    getUsuario()
    connectivity()

  }, [Condition]);

  function connectivity() {
    if (Platform.OS === "android") {
      NetInfo.fetch().then(state=>{if(state.isConnected){

        setInternet(true)
      }
    else{
Alert.alert("Desconectado","Você está desconectado a internet")
setInternet(false)
    }})
    } else {

  }}

  async function acessar() {
   
    getUsuario();
  }

  
  
  async function getUsuario() {
    try {
      if(internet==true){

      const response = await api.get('/Acessoappcoleta');
      const data = response.data.data;

      const realm = await getRealm();
      const store = realm.objects('User');
      console.log(store)

      const indexUsuario = data.findIndex((x) =>(
        (x.email === email
          ? email
          : store[0]?.email&&store[0].logado==true) && 
        (x.senha === senha
          ? senha
          : store[0]?.senha&&store[0].logado==true)
      )
      );
      console.log("DATA"+data[indexUsuario].email)
      if(store[0]!=undefined){
        if(data[indexUsuario].email == store[0].email){
          realm.write(()=>{ 
            realm.create("User", {id:store[0].id, logado:true}, 'modified')
          })
    navigation.navigate('CollectList');

        }else{
          
    let object = realm.objectForPrimaryKey("User",store[0].id)
console.log(object)
            realm.write(()=>{
              realm.delete(object)
            })
          await setUser(data[indexUsuario]);
          if (store[0].token == data[indexUsuario].chave) {
          
            navigation.navigate('CollectList');
          }

        }
      }
      else{
        if(data[indexUsuario]){
          await setUser(data[indexUsuario]);
          navigation.navigate('CollectList');
        }

      }

      
        
      


    }
    else{
      const realm = await getRealm();
      const store = realm.objects('User');
      if(store[0].logado == true){
        dispatch({
          type: 'USER_LOGGED_IN',
          payload: [store[0].nome, store[0].email, store[0].senha, store[0].token],
        });
        navigation.navigate('CollectList');
      }else{

        if(store[0].email == email && store[0].senha == senha){

          const realm = await getRealm();
          
    
          realm.write(() => {
            realm.create('User', {id:store[0].id,
              logado:true
            },'modified');
          });
        navigation.navigate('CollectList');

        }
        else{
          Alert.alert("Sem Internet","Por favor conecte-se a internet para fazer o login de um novo usuário")
        }
      }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function setUser(usuario) {
    console.log("USUARIO"+ usuario.nomeUsuario)
    if (usuario.length != 0) {
      const realm = await getRealm();

      realm.write(() => {
        realm.create("User", {
          id: Math.random() * 1000,
          nome: usuario.nomeUsuario,
          email: usuario.email,
          senha: usuario.senha,
          token: usuario.chave,
          logado:true
        });
      });
      dispatch({
        type: 'USER_LOGGED_IN',
        payload: [
          usuario.nomeUsuario,
          usuario.email,
          usuario.senha,
          usuario.chave,
        ],
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
            borderRadius: 10,
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

        <TouchableOpacity style={styles.btnSubmit} onPress={() => acessar()}>
          <Text style={styles.submitText}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSolicit}>
          <Text style={styles.solicitText}>Solicitar criação de conta</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
