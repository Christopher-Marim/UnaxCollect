import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import {useDispatch, useSelector} from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import commonStyles from '../commonStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import getRealm from '../services/realm';
import {API} from '../../commonsVariables';

export default function Collect(props) {
  const [borderRadiusCONST, setborderRadius] = useState(10);
  const [collects, setCollects] = useState([]);
  const [user, setUser] = useState();
  const [BaseURL, setBaseURL] = useState('');
  const [HeaderValue, setHeaderValue] = useState('');
  const dispatch = useDispatch();

  const getUsuarioRealm = useCallback(async()=>{
    const realm = await getRealm();
    const store = realm.objects('User');
    setUser(store[0]);
  }, []) 

  useEffect(() => {
    getUsuarioRealm();
  }, [getUsuarioRealm]);

  const formatteddate = (collects) =>
    moment(collects.dateAt).locale('pt-br').format('D/MM/YYYY');

  const getData = async () => {
    try {
      const apiText = await AsyncStorage.getItem('@API');
      const apiValue = await AsyncStorage.getItem('@Value');

      if (apiText !== null && apiValue !== null) {
        setBaseURL(apiText);
        setHeaderValue(apiValue);
      }
    } catch (e) {
      alert(e);
    }
  };
  const api = axios.create({
    baseURL: BaseURL ? BaseURL : API.BASE_URL_API,
    headers: {
      Authorization: HeaderValue
        ? HeaderValue
        : API.HEADER_AUTHORIZATION_API,
    },
  });

  async function setApi() {
    console.log(user);
    try {
      collects.itens.forEach(async (x) => {
        await api.post('/coletaelementos', {
          coletaid: x.numberCollect,
          elementoid: x.element,
          valor: x.value,
          system_unit_id: user.system_unit_id,
          system_user_id: user.system_user_id,
        });
      });

      Vibration.vibrate(200);
      DelCollect();
      Alert.alert('Lote Enviado', `Lote ${props.nome} enviado com sucesso`);
    } catch (error) {
      Alert.alert(
        'Post não concluído',
        `Verificar informações da Api em configurações, error: ${error}`,
      );
    }
  }
  async function loadCollects() {
    const realm = await getRealm();
    let idCollect = props.id;
    let data = realm.objectForPrimaryKey('Collects', idCollect);
    setCollects(data);
  }

  useEffect(() => {
    getData();
    loadCollects();
  }, []);

  const getLeftContent = () => {
    return (
      <View style={styles.containerSwipeable}>
        <TouchableOpacity
          style={styles.left1}
          activeOpacity={0.5}
          onPress={() => {
            getUsuarioRealm();
            setApi();
          }}>
          <Icon name="send" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch({type: 'SHOW_MODAL_EDTCOLLECT_ON'});
            dispatch({type: 'CURRENT_ID', payload: [props.id]});
            console.log(props.id);
          }}
          style={styles.left2}
          activeOpacity={0.5}>
          <Icon name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  function refresh() {
    dispatch({type: 'REFRESH', payload: [true]});
    setInterval(() => {
      dispatch({type: 'REFRESH', payload: [false]});
    }, 1000);
  }

  async function DelCollect() {
    const realm = await getRealm();
    let idCollect = props.id;
    let object = realm.objectForPrimaryKey('Collects', idCollect);

    realm.write(() => {
      realm.delete(object);
    });
    refresh();
  }

  const getRightContent = () => {
    return (
      <View style={styles.containerSwipeable}>
        <TouchableOpacity
          onPress={() => {
            DelCollect();
          }}
          style={styles.right}
          activeOpacity={0.5}>
          <Icon name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={getLeftContent}
      renderRightActions={getRightContent}
      onSwipeableWillOpen={() => setborderRadius(0)}
      onSwipeableWillClose={() => setborderRadius(10)}>
      <View
        style={[
          styles.container,
          {
            borderBottomLeftRadius: borderRadiusCONST,
            borderTopLeftRadius: borderRadiusCONST,
          },
        ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ItemList');
            dispatch({type: 'CURRENT_ID', payload: [props.id]});
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <View style={styles.textCollect}>
              <Text style={styles.nomeCollect}>{props.nome}</Text>
              <Text style={{fontWeight: commonStyles.fontWeight}}>
                Data: {formatteddate(`${props.dateAt}`)}
              </Text>
            </View>
            <View style={{justifyContent: 'center', padding: 8}}>
              <Text style={{fontWeight: commonStyles.fontWeight}}>
                Coletas: {props.itens.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    elevation: 1,
    borderLeftWidth: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 5,
    borderLeftColor: commonStyles.color.principal,
    backgroundColor: 'white',
    elevation: 2,
  },
  textCollect: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 10,
  },
  nomeCollect: {
    fontWeight: commonStyles.fontWeight,
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
  },
  left1: {
    backgroundColor: '#194c9e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  left2: {
    backgroundColor: '#4287f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  containerSwipeable: {
    flexDirection: 'row',
  },
  right: {
    backgroundColor: '#bf1f1f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 0,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
});
