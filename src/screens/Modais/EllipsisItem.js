import React, { useState } from "react";

import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import commonStyles from "../../commonStyles";

import getRealm from "../../services/realm";

export default function EllipsisItem() {
  const statusModal = useSelector((state) => state.showModal.showModalELLIPSIS);
  const idCollect = useSelector((state) => state.collects.currentID);


  const dispatch = useDispatch();
  const onRefresh = () => {
    dispatch({ type: "REFRESH", payload: [true] });
    setInterval(() => {
      dispatch({ type: "REFRESH", payload: [false] });
    }, 1000);
  };

  async function DelItem() {
    const realm = await getRealm();

    let data = realm.objectForPrimaryKey("Collects", idCollect);

    realm.write(() => {
     
      data.itens =[]
    });

    onRefresh();
  }

  function closeModal() {
    dispatch({ type: "SHOW_MODAL_ELLIPSIS_OFF" });
  }

  return (
    <Modal
      transparent={true}
      visible={statusModal}
      onRequestClose={closeModal}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.0)",
          alignItems: "flex-start",
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay1} />
        </TouchableWithoutFeedback>
        <View style={{ flexDirection: "row-reverse" }}>
          <View style={styles.container}>
            <TouchableOpacity
            onPress={() => {Alert.alert("Excluir todos os Itens","Todos os itens da Coleta serão Excluidos",  
            [
                {
                  text: "Cancelar",
                  onPress: () => closeModal(),
                  style: "cancel"
                },
                { text: "Prosseguir", onPress: () => {DelItem(), closeModal()} }
              ],
              { cancelable: false })}}
              style={[
                styles.Button,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: "grey",
                },
              ]}
            >
              <Text style={styles.TextButton}>Excluir itens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button}>
              <Text style={styles.TextButton}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.overlay1} />
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay2} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay1: {
    width: "100%",
    flex: 0.9,
  },
  overlay2: {
    width: "100%",
    flex: 8,
  },
  container: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFF",
    width: "40%",
    
  },
  Button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  TextButton: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 16,
    color: commonStyles.color.mainText,
  },
});
