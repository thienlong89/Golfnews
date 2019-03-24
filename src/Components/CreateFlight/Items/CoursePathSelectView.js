import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import PathNameGroup from './PathNameGroup';
import CourseListView from './CourseListView';
import MyView from '../../../Core/View/MyView';
import ListPathModel from '../../../Model/CreateFlight/ListPathModel';
import CourseModel from '../../../Model/CreateFlight/Flight/CourseModel';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';

export default class CoursePathSelectView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.listPathModel = null;
        this.path1_selected = null;
        this.path2_selected = null;
        this.path3_selected = null;
        this.course_selected = null;
        this.teeListAvailable = [];
        this.teeColorName = this.props.teeColor;
        this.typeHole = [9, 18, 27];
        this.state = {
            isHidePath: true,
            listPath: [],
            listCourse: [],
            isHideCourseList: true,
            course_name: '',
            select_type: -1,
            hole_index: 1
        }

        this.onPathGoSelected = this.onPathGoSelected.bind(this);
        this.onPathBackSelected = this.onPathBackSelected.bind(this);
        this.onPathMoreSelected = this.onPathMoreSelected.bind(this);
        this.onChangeCourseClick = this.onChangeCourseClick.bind(this);
        this.onCourseSelectedListener = this.onCourseSelectedListener.bind(this);
    }

    renderPathInfo(select_type, hole_index) {
        if (select_type === 2) {
            let typeHoleView = this.typeHole.map((type, index) => {
                return (
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_hole, { color: hole_index === index ? '#4B9EFF' : '#B8B8B8' }]}
                        onPress={this.onTypeHoleChange.bind(this, type, index)}>
                        {this.t('hole_type').format(type)}
                    </Text>
                )
            })
            return (
                <View style={styles.view_type_hole}>
                    {typeHoleView}
                </View>
            )
        } else {
            return null;
        }

    }

    render() {

        let {
            isHidePath,
            isHideCourseList,
            listPath,
            listCourse,
            course_name,
            select_type,
            hole_index
        } = this.state;

        return (
            <View>
                {/* header include weather info */}
                <View style={styles.facility_info_header}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.facility_info_title} >{this.t('course_info')}</Text>
                    {this.renderPathInfo(select_type, hole_index)}
                </View>

                {/* Path go/back group */}
                <MyView hide={isHidePath} >
                    <View style={[styles.path_group, {
                        borderBottomLeftRadius: hole_index === 0 ? scale(5) : 0,
                        borderBottomRightRadius: hole_index === 0 ? scale(5) : 0
                    }]} >
                        <Text allowFontScaling={global.isScaleFont} style={styles.path_title} >{this.t('path_go')}</Text>
                        <PathNameGroup
                            ref={(goPath) => { this.goPath = goPath; }}
                            listPath={listPath}
                            onPathSelected={this.onPathGoSelected} />
                    </View>
                    <View style={styles.line} />

                    <MyView style={[styles.path_group, {
                        borderBottomLeftRadius: hole_index === 1 ? scale(5) : 0,
                        borderBottomRightRadius: hole_index === 1 ? scale(5) : 0
                    }]} hide={hole_index === 0}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.path_title} >{this.t('path_back')}</Text>
                        <PathNameGroup
                            ref={(backPath) => { this.backPath = backPath; }}
                            listPath={listPath}
                            onPathSelected={this.onPathBackSelected} />
                    </MyView>
                    <View style={styles.line} />

                    <MyView style={[styles.path_group, {
                        borderBottomLeftRadius: scale(5),
                        borderBottomRightRadius: scale(5)
                    }]} hide={hole_index === 0 || hole_index === 1}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.path_title} >{this.t('add')}</Text>
                        <PathNameGroup
                            ref={(backPath) => { this.backPath = backPath; }}
                            listPath={listPath}
                            onPathSelected={this.onPathMoreSelected} />
                    </MyView>
                </MyView>

                {/* Course group */}
                <MyView hide={!isHidePath} >
                    <Touchable onPress={this.onChangeCourseClick} >
                        <View style={[styles.course_group, {
                            borderBottomLeftRadius: isHideCourseList ? scale(5) : 0,
                            borderBottomRightRadius: isHideCourseList ? scale(5) : 0
                        }]} >
                            <Text allowFontScaling={global.isScaleFont} style={styles.course_title} >{this.t('course')}</Text>
                            <View style={styles.tee_select_group}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.course_name} numberOfLines={1}>{course_name}</Text>
                                <Image
                                    style={styles.arrow_down}
                                    source={this.getResources().ic_arrow_right_dark}
                                />
                            </View>
                        </View>
                    </Touchable>
                </MyView>
                <View style={styles.line} />
                <MyView hide={isHideCourseList}>
                    <CourseListView listCourse={listCourse} onCourseSelected={this.onCourseSelectedListener} />
                </MyView>
                {this.renderLoading()}
            </View>
        );
    }

    componentDidMount() {
        this.requestListPath();
    }

    requestListPath() {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.list_paths(this.props.facilityModel.getId());
        console.log('url', url);
        Networking.httpRequestGet(url, this.onListPathResponse.bind(this), () => {
            //time out
            self.loading.hideLoading();
            // self.showErrorMsg(self.t('time_out'))
        });
    }

    onListPathResponse(jsonData) {
        this.loading.hideLoading();
        this.listPathModel = new ListPathModel();
        this.listPathModel.parseData(jsonData);
        console.log('course data...................................', jsonData);
        if (this.listPathModel.getErrorCode() === 0) {
            if (this.listPathModel.getSelectType() === 1) {
                this.setState({
                    isHidePath: true,
                    isHideCourseList: false,
                    listPath: this.listPathModel.getPathList(),
                    listCourse: this.listPathModel.getCourseList(),
                    select_type: 1
                }, () => {
                    this.getCourseDefault(this.listPathModel.getCourseList());
                });
            } else {
                this.setState({
                    isHidePath: false,
                    listPath: this.listPathModel.getPathList(),
                    listCourse: this.listPathModel.getCourseList(),
                    select_type: 2
                });
            }
        } else {
            // this.showErrorMsg(jsonData['error_msg']);
        }
    }

    onTypeHoleChange(type, index) {
        this.setState({
            hole_index: index
        }, () => {
            if (index === 0) {
                this.path2_selected = null;
                this.path3_selected = null;
                this.requestFacilityNew(9);
            } else if (index === 1) {
                this.path3_selected = null;
                if (this.path1_selected && this.path2_selected) {
                    this.setTeeListVisible();
                }
            } else if (index === 2) {
                this.requestFacilityNew(27);
            }

        })
    }

    /**
     * lấy thông tin slope rating theo giới tính
     * @param {*} holeNumber số hố là 9 hoặc 18
     */
    requestFacilityNew(holeNumber = 9) {
        if (holeNumber === 9 && !this.path1_selected) return;
        if (holeNumber === 27 && !this.path2_selected) return;
        let path1 = this.path1_selected ? this.path1_selected.id : '';
        let path2 = this.path2_selected ? this.path2_selected.id : '';
        let path3 = this.path3_selected ? this.path3_selected.id : '';
        console.log('path1_selected', this.path1_selected, this.path2_selected, this.path3_selected)
        let url = this.getConfig().getBaseUrl() + ApiService.get_course_by_path(this.props.facilityModel.getId(), path1, path2, path3);
        console.log('url: ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestFacilityNew', jsonData);

            if (jsonData.error_code === 0) {
                self.course_selected = new CourseModel();
                self.course_selected.parseData(jsonData.data);
                self.teeListAvailable = self.course_selected.getTeeInfoGender();
                self.setCoursePathCallback(2);
            }

        }, () => {
        })
    }

    getCourseDefault(courses) {
        if (courses.length === 1) {
            this.onCourseSelectedListener(courses[0], 0);
        }
    }

    onPathGoSelected(data, itemId) {
        this.path1_selected = data;
        if (this.state.hole_index === 0) {
            this.requestFacilityNew(9);
        } else {
            this.setTeeListVisible();
        }
    }

    onPathBackSelected(data, itemId) {
        this.path2_selected = data;
        if (this.state.hole_index === 3) {
            this.requestFacilityNew(27);
        } else {
            this.setTeeListVisible();
        }
    }

    onPathMoreSelected(data, itemId) {
        this.path3_selected = data;
        this.requestFacilityNew(27);
    }

    setTeeListVisible() {
        let {
            hole_index
        } = this.state;
        if (hole_index === 0 && this.path1_selected
            || hole_index === 1 && this.path1_selected && this.path2_selected
            || hole_index === 2 && this.path1_selected && this.path2_selected && this.path3_selected) {
            this.getListTeeSelected(2, this.path1_selected, this.path2_selected, this.path3_selected, hole_index, null);
        }

    }

    onChangeCourseClick() {
        this.setState({
            isHideCourseList: !this.state.isHideCourseList
        })
    }

    onCourseSelectedListener(data, itemId) {
        console.log('onCourseSelectedListener', data)
        this.course_selected = data;
        this.setState({
            course_name: data.getTitle(),
            isHideCourseList: true,
            // group_display: 2
        }, () => {
            this.getListTeeSelected(1, null, null, null, null, data);
            // this.btnStartCreateFlight.onChangeState(false);
        });

    }

    getListTeeSelected(select_type, path1, path2, path3, hole_index, course) {
        if (select_type === 1) {
            this.teeListAvailable = course.getTeeInfoGender();// this.getTeeList(course.getTeeInfofull());// course.getTeeInfo().getTeeList();

            // if (this.teeListView)
            //     this.teeListView.setChangeTeeList(this.teeListAvailable);

            this.path1_selected = this.state.listPath.find((path) => {
                return course.getPathId1() === path.getId();
            });
        } else {
            let path1Id = path1.getId();
            let path2Id = hole_index === 0 ? path1Id : path2.getId();

            this.course_selected = this.state.listCourse.find((obj) => {
                return ((path1Id === obj.getPathId1() || path1Id === obj.getPathId2())
                    && (path2Id === obj.getPathId1() || path2Id === obj.getPathId2()));
            });
            if (this.course_selected) {
                this.teeListAvailable = this.course_selected.getTeeInfoGender();// this.course_selected.getTeeInfo().getTeeList();
                // console.log('............................. this.teeListAvailable : ', this.teeListAvailable);

                course = this.course_selected;
            }
            console.log('course_selected', this.course_selected);
        }
        console.log('this.teeListAvailable)', this.teeListAvailable);
        this.setCoursePathCallback(select_type);
    }

    setCoursePathCallback(select_type) {
        console.log('teeListAvailable', this.teeListAvailable);
        this.listPathModel.setTeeInfoGender(this.teeListAvailable);
        if (this.props.onCourseCallback) {
            this.props.onCourseCallback(select_type, this.teeListAvailable, this.course_selected, this.path1_selected,
                this.path2_selected, this.path3_selected, this.listPathModel,
                this.state.listPath, this.state.hole_index === 0 ? 2 : this.state.hole_index === 2 ? 3 : 1);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    facility_info_header: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        height: verticalScale(40),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8)
    },
    facility_info_title: {
        flex: 1,
        color: '#454545',
        fontSize: fontSize(15, scale(1)),// 15,
        fontWeight: 'bold',
    },
    path_group: {
        flexDirection: 'row',
        paddingLeft: scale(15),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',

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
    course_group: {
        flexDirection: 'row',
        paddingLeft: scale(15),
        paddingTop: verticalScale(15),
        alignItems: 'center',
        paddingBottom: verticalScale(15),
        backgroundColor: '#FFFFFF',

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
    tee_select_group: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    arrow_down: {
        width: scale(15),
        height: verticalScale(15),
        resizeMode: 'contain',
        marginRight: scale(15),
        marginLeft: scale(10)
    },
    view_type_hole: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt_hole: {
        fontSize: fontSize(15, scale(1)),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        fontWeight: '400'
    }
});