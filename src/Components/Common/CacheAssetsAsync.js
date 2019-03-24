import { Image } from 'react-native';
import { Asset, Font } from '../../Core/Common/ExpoUtils';

export default function cacheAssetsAsync({ files = [], fonts = [], progress_cb = call_back }) {
	console.log(files)
    // return Promise.all([...cacheFiles(files), ...cacheFonts(fonts)]);
    // allProgress([test(1000), test(3000), test(2000), test(3500)],
    allProgress([...cacheFiles(files), ...cacheFonts(fonts)],
		  progress_cb);
}

function test(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
       console.log(`Waited ${ms}`);
       resolve();
     }, ms);
  });
}

function allProgress(proms, progress_cb) {
  let d = 0;
  progress_cb(0);
  proms.forEach((p) => {
    p.then(()=> {    
      d ++;
      progress_cb( (d * 100) / proms.length );
    });
  });
  return Promise.all(proms);
}

function cacheFiles(files) {
    return files.map(file => {
        if (typeof file === 'string') {
            return Image.prefetch(file).then(()=> { console.log("Dine") });
        } else {
            return Asset.fromModule(file).downloadAsync().then(()=> { console.log("Done") });
        }
    });
}

function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
}