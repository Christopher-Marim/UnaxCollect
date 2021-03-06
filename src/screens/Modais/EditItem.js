import React from 'react';
import {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector, connect} from 'react-redux';
import commonStyles from '../../commonStyles';
import getRealm from "../../services/realm";


export default function AddList() {
  const [EdtItem, setEdtItem] = useState('');
  const statusModal = useSelector((state) => state.showModal.showModalEDTITEM);
  const idItem = useSelector((state) => state.collects.currentIDitem);
  const idCollect = useSelector((state) => state.collects.currentID);



  const dispatch = useDispatch();

  function SaveEDTItem() {
    if (!EdtItem || !EdtItem.trim()) {
      Alert.alert('Dados Invalidos', 'Descrição não Informada!');
      return;
    } else {
      UpdateItem()
      closeModal()
      setEdtItem('')
      dispatch({type: 'REFRESH', payload:[true]})
        setInterval(() => {
          dispatch({type: 'REFRESH', payload:[false]})
         }, 1000)

    }
  }

  async function UpdateItem() {
    const realm = await getRealm();

    let data = realm.objectForPrimaryKey("Collects",idCollect)
    
    realm.write(() => {
      let indexItem = data.itens.findIndex(x=> x.id ==idItem)
      data.itens[indexItem].value = EdtItem
    });
    dispatch({ type: "REFRESH", payload: [true] });
    setInterval(() => {
      dispatch({ type: "REFRESH", payload: [false] });
    }, 1000);

  }
  function closeModal() {
    dispatch({type: 'SHOW_MODAL_EDTITEM_OFF'});
  }

  return (
    <Modal
      transparent={true}
      visible={statusModal}
      onRequestClose={closeModal}
      animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.headerModal}> Editar Valor</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe a Quantidade"
            onChangeText={(text) => setEdtItem(text)}
            keyboardType={"default"}
            value={EdtItem}
          />

          <View style={styles.buttons}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={SaveEDTItem}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: '100%',
    flex: 1,
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    width: '95%',
  },
  headerModal: {
    fontFamily: commonStyles.fontFamily,
    fontWeight:commonStyles.fontWeight,
    backgroundColor: commonStyles.color.principal,
    color: commonStyles.color.secondary,
    fontSize: 18,
    textAlign: 'center',
    padding: 18,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
    marginRight: 30,
    fontWeight:commonStyles.fontWeight,
    color: commonStyles.color.today,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    fontWeight:commonStyles.fontWeight,
    paddingHorizontal:5,
    height: 40,
    marginTop: 10,
    margin: 15,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderColor: 'grey',
    borderRadius: 6,
    backgroundColor: '#f1f2f4',
  },
});
