import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Platform} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import commonStyles from '../commonStyles';
import getRealm from '../services/realm';
import api from '../services/api'
import NetInfo from '@react-native-community/netinfo'

export default function Profile(props) {

  useEffect(()=>{
    async function getUsuarioRealm(){
  const realm = await getRealm();
  const store = realm.objects("User");
  setNome(store[0].nome)
  setEmail(store[0].email)
  setSenha(store[0].senha)
    }
    getUsuarioRealm()
    CheckConnectivity()
  },[])

  const [editableNome, setEditableNome] = useState(false)
  const [nome, setNome] = useState('Usuario')
  const [senha, setSenha] = useState()
  const [email, setEmail] = useState()
  const [internet, setInternet] = useState()
  const [ButonSalvar, setButtonSalvar] = useState(false)


  const refNome = useRef(null)
  const refSenha = useRef(null)
  const refEmail = useRef(null)

  async function EditarUsuario(){
    try{
      const realm = await getRealm();
      const store = realm.objects("User");
  
      realm.write(()=>{
        realm.create("User",{id:store[0].id, nome:nome, email:email, senha:senha}, 'modified')
      })
  
      const res = await api.put(`/Acessoappcoleta/${store[0].id}`,{
          nomeUsuario:nome,
          email:email,
          senha:senha
      })
      console.log(res.status)
      setButtonSalvar(false)
      Alert.alert("Alteração Feita", "Recomenda-se fechar e abrir a aplicação para as mudanças serem efetivadas.")
    }
    catch(error){
      console.log(error)
    }
      

  }

  function CheckConnectivity(){

    if (Platform.OS === "android") {
      NetInfo.fetch().then(state=>{if(state.isConnected){
        setInternet(true)
      }
    else{
      setInternet(false)

    }})
    } else {

      
      // For iOS devices
      NetInfo.addEventListener(
        "connectionChange",
        handleFirstConnectivityChange()
      );
    }
    
  };
  

 const handleFirstConnectivityChange = isConnected => {
    NetInfo.removeEventListener(
      "connectionChange",
      handleFirstConnectivityChange()
    );

    if (isConnected === false) {  
      setInternet(false)
    } else {
      setInternet(true)

    }
  };


  const getFocusInputNome = () => {
    refNome.current.focus();
  };
  const getFocusInputSenha = () => {
    refSenha.current.focus();
  };
  const getFocusInputEmail = () => {
    refEmail.current.focus();
  };
  return (
    <KeyboardAwareScrollView style={{flex:1}}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.buttonGoBack}
          onPress={() => props.navigation.goBack()}>
          <View>
            <FontAwesome
              name="chevron-left"
              size={25}
              style={{fontWeight:'bold'}}
              color="white"></FontAwesome>
          </View>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.avatar}
        source={require('../../assets/icon2.png')}
      />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>{'Christopher Marim'}</Text>
          <Text>christopher.marim@etm.srv.br</Text>
        </View>
        <View style={styles.containerInfos}>
          <View>
          <Text style={styles.textInfo}>Informações da conta</Text>  
          </View>
          <View style={styles.containerButtons}> 
            <TouchableOpacity style={styles.button} onPress={()=>{getFocusInputNome()}} >
              <EvilIcons name={'user'} size={60}/>
              <View style={styles.texts}>
              <Text style={styles.subText}>Nome</Text>
              <TextInput style={{height:40,color:'#696969'}} placeholder={nome} ref={refNome} value={nome} onChangeText={(text)=>{setNome(text)}} onSubmitEditing={()=>{setButtonSalvar(true)}}/>
                
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.button, paddingLeft:10}} onPress={()=>{ getFocusInputSenha()}} >
              <MaterialCommunityIcons name={'form-textbox-password'} size={45}/>
              <View style={{...styles.texts, paddingLeft:13}}>
              <Text style={styles.subText}>Senha</Text>
              <TextInput style={{height:40, color:'#696969'}} secureTextEntry={true} ref={refSenha} value={senha} onChangeText={(text)=>{setSenha(text)}} onSubmitEditing={()=>{setButtonSalvar(true)}} />
                
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.button, paddingLeft:10}} onPress={()=>{getFocusInputEmail()}} >
              <MaterialCommunityIcons name={'email-outline'} size={45}/>
              <View style={{...styles.texts, paddingLeft:13}}>
              <Text style={styles.subText}>Email</Text>
              <TextInput style={{height:40, color:'#696969'}} placeholder={email} keyboardType={'email-address'} ref={refEmail} value={email} onChangeText={(text)=>{setEmail(text)}} onSubmitEditing={()=>{setButtonSalvar(true)}} />
                
              </View>
            </TouchableOpacity>
            {(ButonSalvar==true)&&(
              <TouchableOpacity style={styles.buttonSalvar} onPress={()=>{if(internet==true){EditarUsuario()} else{Alert.alert("Sem Internet", "Mudanças no usuário só podem ser realizadas com conexão a internet")}}}>
              <Text style={styles.textSalvar}>Salvar</Text>

            </TouchableOpacity>
            )
            }
           
          </View>
        </View>

      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex:1,
    paddingTop: 30,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: commonStyles.color.principal,
    
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 35,
    backgroundColor:commonStyles.color.principal
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    flex:8,
    marginTop: 80,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },

  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#222222',
  },
  buttonGoBack: {
    justifyContent: 'center',
    paddingBottom:25
  },
  

  headerView: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: commonStyles.color.principal,
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: commonStyles.color.secondary,
  },
  containerInfos: {
    flex:9,
    paddingTop: 40,
    paddingHorizontal: 50,
  },
  textInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'arial',
    color:'black',

  },
  containerButtons:{
  paddingTop:30,
    },
    button:{
      flexDirection:'row',
      alignItems: 'center'
    },
    texts:{
      padding:10
    },
    subText:{
      fontWeight:'bold'
    },
    textSalvar:{
      fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'arial',
    color:commonStyles.color.secondary,
    },
    buttonSalvar:{ 
      marginHorizontal:50,padding:10, marginTop:20, justifyContent:'center', alignItems:'center', borderWidth:2, borderRadius:10, backgroundColor:commonStyles.color.principal 
    }
});
