async function permissionsAskAsync(textPermission){
    return new Promise(resolve => {
        console.log("textPermission", textPermission);
        resolve("");
    });
}

rotateToLandscape = ()=>{
  console.log("rotateToLandscape");
  
}

rotateToPortrait = () =>{
        console.log("rotateToPortrait");
       
}

var _Constants = {
  statusBarHeight: 12
}

var _Expo = {
  ScreenOrientation:{
    allow:(key)=>{
      console.log('ScreenOrientation');
      _mapOrientation[key]();
    },
    Orientation:{
      PORTRAIT:1,
      LANDSCAPE:0
    }

  },
  Constants:{
    platform:{
      ios:{
        model:''
      },
      android:{
        model:'Sansum S9'
      }
    }
  }
}
var _mapOrientation = {
		1:rotateToPortrait,
		0:rotateToLandscape
}
module.exports = {
  rotateToLandscape,
  permissionsAskAsync,
  rotateToPortrait,
  Constants: _Constants,
  Expo: _Expo
}

_Expo.ScreenOrientation.allow(_Expo.ScreenOrientation.Orientation.PORTRAIT);
