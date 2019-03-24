import { Platform, StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flight_time_group: {
    flexDirection: 'row',
    height: verticalScale(50),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    marginTop: scale(10),
    marginBottom: scale(10),
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
  },
  datepicker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img_calendar: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
    marginRight: scale(10)
  },
  text_flight_time: {
    flex: 1,
    fontSize: fontSize(15, scale(1)),// 15,
    fontWeight: 'bold',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10)
  },
  touchable_calendar: {
    alignItems: 'center',
    paddingLeft: scale(10),
    paddingRight: scale(10),
    justifyContent: 'center'
  },
  icon_calendar: {
    width: verticalScale(20),
    height: verticalScale(20),
    resizeMode: 'contain'
  },
  facility_info_header: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    height: verticalScale(30),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    alignItems: 'center'
  },
  facility_info_title: {
    flex: 1,
    color: '#B8B8B8',
    fontSize: fontSize(15, scale(1)),// 15
  },
  view_weather_group: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  facility_info_weather: {
    color: '#6B6B6B',
    fontSize: fontSize(13, -scale(1)),// 13
  },
  // icon_weather: {
  //   height: 20,
  //   width: 20,
  //   resizeMode: 'contain',
  //   marginRight: 3
  // },
  path_group: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  path_title: {
    color: '#454545',
    fontSize: fontSize(15, scale(1)),// 15,
    marginRight: scale(15),
    minWidth: 65
  },
  path_group_all: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  path_index: {
    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: verticalScale(20),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: fontSize(17, scale(2)),// 17,
    color: '#707070',
    marginRight: scale(13),
    alignSelf: 'center'
  },
  line: {
    height: verticalScale(0.5),
    backgroundColor: '#EBEBEB'
  },
  tee_group: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    paddingTop: verticalScale(15),
    alignItems: 'center',
    paddingBottom: verticalScale(15),
    backgroundColor: '#FFFFFF'
  },
  tee_select_group: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  course_tee: {
    width: scale(15),
    height: verticalScale(15),
    marginRight: scale(5),
    borderColor: '#919191',
    borderWidth: scale(0.5)
  },
  course_tee_name: {
    color: '#737373',
    fontSize: fontSize(15, scale(1)),// 15,
    marginLeft: scale(5),
    marginRight: scale(10)
  },
  arrow_down: {
    width: scale(15),
    height: verticalScale(15),
    resizeMode: 'contain',
    marginRight: scale(15),
    marginLeft: scale(10)
  },
  touchable_btn_start: {
    paddingBottom: verticalScale(15),
    paddingTop: verticalScale(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn_start: {
    color: '#FFFFFF',
    fontSize: fontSize(20, scale(6)),// 20
  },
  course_group: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    paddingTop: verticalScale(15),
    alignItems: 'center',
    paddingBottom: verticalScale(15),
    backgroundColor: '#FFFFFF'
  },
  course_title: {
    color: '#454545',
    fontSize: fontSize(15, scale(1)),// 15,
    marginRight: scale(20)
  },
  course_name: {
    fontSize: fontSize(15, scale(1)),// 15,
    color: '#737373',
    marginLeft: scale(50)
  },
  player_header: {
    backgroundColor: '#F2F2F2',
    height: verticalScale(30),
    paddingLeft: scale(10),
    justifyContent: 'center'
  },
  player_text_header: {
    color: '#B8B8B8',
    fontSize: fontSize(15, scale(1)),// 15
  },
  touchable_add_player: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00ABA7',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(10),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(15)
  },
  text_add_player: {
    color: '#00ABA7',
    fontSize: fontSize(17, scale(2)),// 17
  },
  popup_style: {
    width: scale(300),
    height: verticalScale(200),
    backgroundColor: '#FFFFFF'
  },
  popup_title_style: {
    color: '#000000',
    fontSize: fontSize(17, scale(2)),// 17,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    textAlign: 'center'
  },
  upload_score_view: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  icon_camera: {
    height: verticalScale(25),
    width: scale(25),
    resizeMode: 'contain',
    marginRight: scale(15)
  },
  swipe_left_to_typing: {
    fontSize: fontSize(12, -scale(2)),// 12,
    color: '#FFFFFF',
    textAlign: 'center'
  },
  touchable_swipe_start: {
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  skip_view: {
    flexDirection: 'row',
    paddingLeft: scale(10),
    paddingRight: scale(10),
    alignItems: 'center',
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(15),
    marginTop: verticalScale(5),
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  skip_txt: {
    color: '#FFFFFF',
    fontSize: fontSize(15, scale(1)),// 15,
    marginLeft: scale(10)
  },
  skip_now: {
    color: '#00ABA7',
    fontSize: fontSize(15, scale(1)),// 15,
  },
  next_tut: {
    color: '#00ABA7',
    fontSize: fontSize(15, scale(1)),// 15,
  },
  ic_check: {
    height: verticalScale(23),
    width: scale(23),
    resizeMode: 'contain'
  },
  submit_notify: {
    color: '#FFFFFF', backgroundColor: '#000', padding: scale(10), marginTop: verticalScale(5), justifyContent: 'center', alignItems: 'center'
  },
  view_tut: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tut_text: {
    color: '#FFFFFF',
    padding: scale(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  border_shadow: {
    elevation: 4,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: "grey",
    shadowOpacity: 1,
    shadowRadius: scale(8),
    borderRadius: scale(8),
    margin: scale(10)
  }
});

module.exports = styles;
