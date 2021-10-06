import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Drawer,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../commonStyles';
import getRealm from '../services/realm';
import { useCallback } from 'react';

export default (props) => {
   const getUsuarioRealm = useCallback(async()=>{
    const realm = await getRealm();
    const store = realm.objects('User');
    setnome(store[0]?.nome);
    setemail(store[0]?.email);
  }, []) 

  useEffect(() => {
    getUsuarioRealm();
  }, [getUsuarioRealm]);


  const [nome, setnome] = useState('Usuário');
  const [email, setemail] = useState();

  async function Deslogar() {
    const realm = await getRealm();

    realm.write(() => {
      realm.deleteAll();
    });
    props.navigation.replace('Login');
  }

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row'}}>
              <Avatar.Image
                source={require('../../assets/icon2.png')}
                size={50}
              />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title numberOfLines={1} style={styles.title}>{nome}</Title>
                <Caption style={styles.email}>{email}</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Principal"
              onPress={() => {
                props.navigation.navigate('CollectList');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <MaterialCommunityIcons
                  name="account-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Perfil"
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <MaterialCommunityIcons name="send" color={color} size={size} />
              )}
              label="Bips"
              onPress={() => {}}
            />
            <DrawerItem
              icon={({color, size}) => (
                <MaterialCommunityIcons
                  name="database-settings"
                  color={color}
                  size={size}
                />
              )}
              label="Configurações"
              onPress={() => {
                props.navigation.navigate('Configs');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <MaterialCommunityIcons
                  name="account-check-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Support"
              onPress={() => {
                Linking.openURL('http://www.etm.srv.br/');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={color}
              size={size}
            />
          )}
          label="Sair"
          onPress={() => {
            Deslogar();
          }}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    backgroundColor: commonStyles.color.principal,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: commonStyles.fontWeight,
    marginTop: 3,
    fontWeight: 'bold',
    color: 'white',
    width: 150,
  },
  caption: {
    fontSize: 14,
    fontWeight: commonStyles.fontWeight,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 2,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  email: {
    fontSize: 10,
    fontWeight: commonStyles.fontWeight,
    lineHeight: 14,
    color: 'white',
  },
});
