
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export default class SoundManager {
    constructor() {
        this.sound = null;
        this.error = null;
        this.isLoaded = false;
    }

    create(file) {
        if (this.sound) return;
        console.log('..........................create sound file : ',file);
        this.sound = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
            console.log('................... load file : ',error);
            if (error) {
                console.error('.......................failed to load the sound', error);
                this.error = error;
                return;
            }
            // loaded successfully
            this.isLoaded = true;
            // this.setVolume();
            console.log('duration in seconds: ' + this.sound.getDuration() + 'number of channels: ' + this.sound.getNumberOfChannels());
        });
    }

    play(){
        // console.log('.................................. isLoaded : ',this.sound.isLoaded());
        if(!this.isLoaded || this.sound.isPlaying()) return;
        this.sound.play();
    }

    setVolume(_volume = 0.5){
        if(!this.sound) return;
        this.sound.setVolume(_volume);
    }

    pause(){
        if(!this.isLoaded) return;
        this.sound.pause();
    }

    release(){
        if(!this.sound) return;
        this.sound.release();
    }

    stop(callback = null){
        if(!this.sound) return;
        this.sound.stop(()=>{
            if(callback){
                callback();
            }
        });
    }
}