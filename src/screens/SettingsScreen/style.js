import {StyleSheet} from 'react-native';
import commonStyles from "../../commonStyles";


export default  StyleSheet.create({
    container: {
        flex: 9,
        flexDirection: 'column',
        backgroundColor: '#fff',        
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      },
      
      action:{
        backgroundColor:'white',
        paddingHorizontal:15,
        height: 55,
        width:'100%',
        justifyContent:'center',
        alignItems:"baseline",
        borderBottomWidth:2,
        borderBottomColor:'#D3D4D8',
        
      },
      actionText:{
        paddingLeft:20,
        color:'#9c9c9c',
        fontSize:15,
        fontFamily: commonStyles.fontFamily,
        fontWeight: commonStyles.fontWeight,
      },
     
   
    
      headerView: {
        flex: 1,
        flexDirection:'row',
        paddingHorizontal:20,
        backgroundColor: commonStyles.color.principal,
        alignItems: "center",
        justifyContent: "space-between",
      },
      text: {
        fontFamily: commonStyles.fontFamily,
        fontWeight: commonStyles.fontWeight,
        fontSize: 25,
        color: commonStyles.color.secondary,
        borderBottomWidth: 2,
        borderBottomColor: "#FFF",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
      },
})