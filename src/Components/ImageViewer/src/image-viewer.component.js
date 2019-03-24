import React, {
    Component,
  } from 'react';
  import {
    View,
    Text,
    Image,
    CameraRoll,
    Dimensions,
    Platform,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
  } from 'react-native';
  import {
    Props,
    State,
  } from './image-viewer.type';
  import ImageZoom from 'react-native-image-pan-zoom';
  import styles from './image-viewer.style';
  
  class ImageViewer extends Component {
    constructor(props) {
      super(props);
      this.state = new State();
      this.width = 0;
      this.height = 0;
      this.styles = styles(Dimensions.get('window').width, Dimensions.get('window').height);
      // 是否执行过 layout. fix 安卓不断触发 onLayout 的 bug
      this.hasLayout = false;
      // 记录已加载的图片 index
      this.loadedIndex = {};
    }
    componentWillUnmount() {
      this._isMount = false;
    }
    componentWillMount() {
      this._isMount = true;
      this.init(this.props)
    }
    /**
     * Props变更时候初始化
     */
    init(nextProps) {
      if (nextProps.imageUrls.length === 0) {
        // 隐藏时候清空
        return this._isMount && this.setState(new State());
      }
      // 给 imageSizes 塞入空数组
      const imageSizes = nextProps.imageUrls.map(v => {
        return {
          width: v.width || 0,
          height: v.height || 0,
          status: 'loading',
        };
      });
  
      this._isMount && this.setState({
        currentShowIndex: nextProps.index,
        imageSizes,
      }, () => {
        this.jumpTo(nextProps.index, false);
      });
    }
    /**
     * 调到当前看图位置
     */
    jumpTo(index = 0, animated = true) {
      // 立刻预加载要看的图
      this.loadImage(index);
      if (this.width && this.refs.scrollview) {
        setTimeout(() => this.refs.scrollview.scrollTo({ x: this.width * index, animated }), 0);
      }
    }
    /**
     * 加载图片
     */
    loadImage(index) {
      if (this.loadedIndex.hasOwnProperty(index)) {
        return;
      }
      this.loadedIndex[index] = true;
      const image = this.props.imageUrls[index];
      const imageStatus = Object.assign({}, this.state.imageSizes[index]);
      // 保存 imageSize
      const saveImageSize = () => {
        // 如果已经 success 了，就不做处理
        if (this.state.imageSizes[index] && this.state.imageSizes[index].status !== 'loading') {
          return;
        }
        const imageSizes = this.state.imageSizes.slice();
        imageSizes[index] = imageStatus;
        this._isMount && this.setState({
          imageSizes,
        });
      }
      if (this.state.imageSizes[index].status === 'success') {
        // 已经加载过就不会加载了
        return;
      }
      // 如果已经有宽高了，直接设置为 success
      if (this.state.imageSizes[index].width > 0 && this.state.imageSizes[index].height > 0) {
        imageStatus.status = 'success';
        saveImageSize();
        return;
      }
      // 是否加载完毕了图片大小
      let sizeLoaded = false;
      // 是否加载完毕了图片
      let imageLoaded = false;
      const prefetchImagePromise = Image.prefetch(image.url);
      // 图片加载完毕回调
      prefetchImagePromise.then(() => {
        imageLoaded = true;
        if (sizeLoaded) {
          imageStatus.status = 'success';
          saveImageSize();
        }
      }, () => {
        // 预加载失败
        imageStatus.status = 'fail';
        saveImageSize();
      })
      // 获取图片大小
      if (image.width && image.height) {
        // 如果已经传了图片长宽,那直接 success
        sizeLoaded = true;
        imageStatus.width = image.width;
        imageStatus.height = image.height;
        if (imageLoaded) {
          imageStatus.status = 'success';
          saveImageSize();
        }
      } else {
        Image.getSize(image.url, (width, height) => {
          sizeLoaded = true;
          imageStatus.width = width;
          imageStatus.height = height;
          if (imageLoaded) {
            imageStatus.status = 'success';
            saveImageSize();
          }
        }, (error) => {
          // 获取大小失败
          imageStatus.status = 'fail';
          saveImageSize();
        });
      }
    }
    /**
     * 触发溢出水平滚动
     */
    handleHorizontalOuterRangeOffset(offsetX) {
      if (offsetX < 0) {
        if (this.state.currentShowIndex < this.props.imageUrls.length - 1) {
          this.loadImage(this.state.currentShowIndex + 1);
        }
      } else if (offsetX > 0) {
        if (this.state.currentShowIndex > 0) {
          this.loadImage(this.state.currentShowIndex - 1);
        }
      }
    }
    /**
     * 手势结束，但是没有取消浏览大图
     */
    handleResponderRelease(vx) {
      if (vx > 0.7) {
        this.goBack.call(this);
      } else if (vx < -0.7) {
        this.goNext.call(this);
      }
    }
    /**
     * 到上一张
     */
    goBack() {
      if (this.state.currentShowIndex === 0) {
        return;
      }
      this.resetImage(this.state.currentShowIndex);
      this.jumpTo(this.state.currentShowIndex - 1);
    }
    /**
     * 到下一张
     */
    goNext() {
      if (this.state.currentShowIndex === this.props.imageUrls.length - 1) {
        return;
      }
      this.resetImage(this.state.currentShowIndex);
      this.jumpTo(this.state.currentShowIndex + 1);
    }
    /**
     * 恢复原样图
     */
    resetImage(index = 0) {
      const imageZoom = this.refs[`zoom_${index}`];
      imageZoom && imageZoom.scale !== 1 && imageZoom.reset && imageZoom.reset();
    }
    /**
     * 长按
     */
    handleLongPress(image) {
      if (this.props.saveToLocalByLongPress) {
        // 出现保存到本地的操作框
        this._isMount && this.setState({
          isShowMenu: true,
        });
      }
    }
    /**
     * 单击
     */
    handleClick() {
      this.props.onClick(this.handleCancel.bind(this));
    }
    /**
     * 双击
     */
    handleDoubleClick() {
      this.props.onDoubleClick(this.handleCancel.bind(this));
    }
    /**
     * 退出
     */
    handleCancel() {
      this.hasLayout = false;
      this.props.onCancel();
    }
    /**
     * 完成布局
     */
    handleLayout(event) {
      if (this.hasLayout) {
        return;
      }
      this.hasLayout = true;
      this.width = event.nativeEvent.layout.width;
      this.height = event.nativeEvent.layout.height;
      this.styles = styles(this.width, this.height);
      // 强制刷新
      this.forceUpdate();
      this.jumpTo(this.state.currentShowIndex, false);
    }
    handleScroll(event) {
      const newindex = Math.round(event.nativeEvent.contentOffset.x / this.width);
      const oldIndex = this.state.currentShowIndex;
      this._isMount && newindex !== oldIndex && this.setState({
        currentShowIndex: newindex,
      }, () => {
        this.resetImage(oldIndex);
        this.loadImage(newindex);
        this.props.onChange(newindex);
      });
    }
    /**
     * 获得整体内容
     */
    getContent() {
      // 获得屏幕宽高
      const screenWidth = this.width;
      const screenHeight = this.height;
      const ImageElements = this.props.imageUrls.map((image, index) => {
        let width = this.state.imageSizes[index] && this.state.imageSizes[index].width;
        let height = this.state.imageSizes[index] && this.state.imageSizes[index].height;
        const imageInfo = this.state.imageSizes[index];
        // 如果宽大于屏幕宽度,整体缩放到宽度是屏幕宽度
        if (width > screenWidth) {
          const widthPixel = screenWidth / width;
          width *= widthPixel;
          height *= widthPixel;
        }
        // 如果此时高度还大于屏幕高度,整体缩放到高度是屏幕高度
        if (height > screenHeight) {
          const HeightPixel = screenHeight / height;
          width *= HeightPixel;
          height *= HeightPixel;
        }
        switch (imageInfo.status) {
          case 'loading':
            return (
              <TouchableHighlight
                key={index}
                onPress={this.handleClick.bind(this)}
                style={this.styles.loadingTouchable}
              >
                <View style={this.styles.loadingContainer}>
                  {this.props.loadingRender()}
                </View>
              </TouchableHighlight>
            );
          case 'success':
            const NeoView = this.props.enableImageZoom ? ImageZoom : TouchableOpacity;
            return (
              <NeoView
                ref={`zoom_${index}`}
                key={index}
                activeOpacity={1}
                style={this.styles.modalContainer}
                cropWidth={this.width}
                cropHeight={this.height}
                imageWidth={width}
                imageHeight={height}
                maxOverflow={this.props.maxOverflow}
                horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset.bind(this)}
                responderRelease={this.handleResponderRelease.bind(this)}
                onLongPress={this.handleLongPress.bind(this, image)}
                onClick={this.handleClick.bind(this)}
                onDoubleClick={this.handleDoubleClick.bind(this)}
              >
                <Image
                  style={[this.styles.imageStyle, { width: width, height: height,resizeMode : 'contain' }]}
                  source={{ uri: image.url }}
                />
              </NeoView>
            );
          case 'fail':
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                style={this.styles.failContainer}
              >
                <Image
                  source={this.props.failImageSource}
                  style={this.styles.failImage}
                />
              </TouchableOpacity>
            );
        }
      });
  
      return (
        <View style={this.styles.container}>
          {this.props.renderHeader()}
          <View style={this.styles.arrowLeftContainer}>
            <TouchableWithoutFeedback onPress={this.goBack.bind(this)}>
              <View>
                {this.props.renderArrowLeft()}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={this.styles.arrowRightContainer}>
            <TouchableWithoutFeedback onPress={this.goNext.bind(this)}>
              <View>
                {this.props.renderArrowRight()}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <ScrollView
            ref="scrollview"
            style={this.styles.moveBox}
            horizontal={true}
            pagingEnabled={true}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={this.handleScroll.bind(this)}
          >
            {ImageElements}
          </ScrollView>
          {
            this.props.imageUrls.length > 1 &&
            this.props.renderIndicator(this.state.currentShowIndex + 1, this.props.imageUrls.length)
          }
          {
            this.props.imageUrls[this.state.currentShowIndex].originSizeKb && this.props.imageUrls[this.state.currentShowIndex].originUrl && (
              <View style={this.styles.watchOrigin}>
                <TouchableOpacity style={this.styles.watchOriginTouchable}>
                  <Text allowFontScaling={global.isScaleFont} style={this.styles.watchOriginText}>查看原图(2M)</Text>
                </TouchableOpacity>
              </View>
            )
          }
          {this.props.renderFooter()}
        </View>
      );
    }
    /**
     * 保存当前图片到本地相册
     */
    saveToLocal() {
      if (!this.props.onSave) {
        CameraRoll.saveToCameraRoll(this.props.imageUrls[this.state.currentShowIndex].url);
        this.props.onSaveToCamera(this.state.currentShowIndex);
      } else {
        this.props.onSave(this.props.imageUrls[this.state.currentShowIndex].url);
      }
      this._isMount && this.setState({
        isShowMenu: false,
      });
    }
    getMenu() {
      if (!this.state.isShowMenu) {
        return null;
      }
      return (
        <View style={this.styles.menuContainer}>
          <View style={this.styles.menuShadow} />
          <View style={this.styles.menuContent}>
            <TouchableHighlight
              underlayColor="#F2F2F2"
              onPress={this.saveToLocal.bind(this)}
              style={this.styles.operateContainer}
            >
              <Text allowFontScaling={global.isScaleFont} style={this.styles.operateText}>
                {this.props.menuContext.saveToLocal}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#F2F2F2"
              onPress={this.handleLeaveMenu.bind(this)}
              style={this.styles.operateContainer}
            >
              <Text allowFontScaling={global.isScaleFont} style={this.styles.operateText}>
                {this.props.menuContext.cancel}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
    handleLeaveMenu() {
      this._isMount && this.setState({
        isShowMenu: false,
      })
    }
    render() {
      return (
        <View
          onLayout={this.handleLayout.bind(this)}
          style={[{ flex: 1, overflow: 'hidden' }, this.props.style]} {...this.props.others}
        >
          {this.getContent()}
          {this.getMenu()}
        </View>
      );
    }
  }
  
  ImageViewer.defaultProps = new Props();
  
  export default ImageViewer;