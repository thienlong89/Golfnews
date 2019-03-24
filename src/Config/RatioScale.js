import { Dimensions,Platform } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
/**
 * Resize cho cac màn hình iphone và ipad theo chiều ngang màn hình
 * @param {number} size kích thước chuẩn
 */
const scale = function(size){
    if(Platform.OS === 'android'){
        // console.log('.....................android scale');
        return size;
    }
    return width / guidelineBaseWidth * size;
}
/**
 * Resize cho các màn hình iphone và ipad theo chiều dọc màn hình
 * @param {number} size kích thước chuẩn
 */
const verticalScale = function(size){
    if(Platform.OS === 'android'){
        return size;
    }
    return height / guidelineBaseHeight * size;
}
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

/**
 * tra ve font size cho cac man hinh
 * hàm này đảm bảo android fontSize không bị thay đôi
 * @param {number} android_font 
 * @param {number} delta gia tri cong them hay trừ đi với font gốc
 */
const fontSize = function(android_font,delta=0){
    if(Platform.OS === 'android'){
        return android_font;
    }
    return width*0.037 + delta;
}

export {scale, verticalScale, moderateScale,fontSize};