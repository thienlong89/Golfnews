import { Platform, StyleSheet, Dimensions } from 'react-native';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#FF0'
  },
  dropdown_text: {
    // ...Platform.select({
    //   ios: {
    //     paddingTop: 10
    //   },
    //   android: {
    //     textAlignVertical: 'center',
    //   }
    // }),
    fontSize: fontSize(17),// 17,
    color: '#A1A1A1',
    textAlign: 'left',
    height: verticalScale(40),
    paddingLeft: scale(15),
    paddingRight: scale(15)
  },
  dropdown_text_highlight: {
    fontSize: fontSize(17),// 17,
    color: '#99E6FF',
    textAlign: 'left',
    textAlignVertical: 'center',
    height: verticalScale(40),
    paddingLeft: scale(15),
    paddingRight: scale(15)
  },
  dropdown_dropdown: {
    width: width - scale(30),
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 3
  },
  text_dropdown: {
    color: '#615B5B',
    paddingLeft: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    fontSize : fontSize(17)
  },

  country: {
    backgroundColor: '#F5F5F5',
    borderColor: '#DBDBDB',
    flexDirection : 'row',
    borderWidth: (Platform.OS === 'ios') ? 1 : 0.5,
    borderRadius: 5,
    marginRight: scale(15),
    marginTop: verticalScale(15),
    marginLeft: scale(15),
    height: verticalScale(40)
  },
  arrow_down: {
    ...Platform.select({
      ios: {
        width: scale(23),
        height: verticalScale(23),
        marginLeft: 5,
        marginRight: 5
      },
      android: {
        width: scale(23),
        height: verticalScale(23),
        marginLeft: 5,
        marginRight: 5
      },
    }),
    position: 'absolute',
    resizeMode: 'contain',
    right: 0,
    top: 0,
    bottom: 0,
    height: verticalScale(40)
  },
  search_group: {
    // backgroundColor: '#F5F5F5',
    // borderColor: '#DBDBDB',
    // borderWidth: 0.5,
    // borderRadius: 5,
    marginRight: scale(15),
    marginTop: verticalScale(15),
    marginLeft: scale(15),
    flex : 1
    //height: 40
  },
  text_input_facility: {
    height: verticalScale(37.5),
    color: '#A1A1A1',
    fontSize: fontSize(17),// 17,
    lineHeight : fontSize(21,verticalScale(4)),// 21,
    paddingLeft: scale(5),
    paddingTop: 0,
        paddingBottom: 0
  },
  icon_search: {
    ...Platform.select({
      ios: {
        width: scale(23),
        height: verticalScale(23),
        marginLeft: 5,
        marginRight: 5
      },
      android: {
        width: scale(23),
        height: verticalScale(23),
        marginLeft: 5,
        marginRight: 5
      }
    }),
    resizeMode: 'contain',
   // backgroundColor: '#FFFFFF',
    borderColor: '#DBDBDB',
    marginBottom: 1
  },
  input_search: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: verticalScale(37.5)
  },
  arrow_down_search: {
    ...Platform.select({
      ios: {
        width: scale(23),
        height: verticalScale(23),
        marginLeft: 5,
        marginRight: 5
      },
      android: {
        width: scale(23),
        height: verticalScale(23),
        marginLeft: 5,
        marginRight: 5
      }
    }),
    resizeMode: 'contain',
    borderColor: '#DBDBDB'
  },
  dropdown_search_button: {
    position: 'absolute',
    flex: 1,
    height: verticalScale(40)
  },

  list_course: {
    marginLeft: 0,//15,
    marginRight: 0,//15,
    marginTop: verticalScale(5),
    //height : 200
    // borderColor: '#DBDBDB',
    // borderWidth: (Platform.OS === 'ios') ? 1 : 0.5,
  },

  listview_separator: {
    //flex: 1,
    height: verticalScale(1),
    backgroundColor: '#E3E3E3',
  }

});

module.exports = styles;
