
cc.Class({
    extends: cc.Component,

    properties: {
        bgmAudioID:-1,
        effAudioID:-1,

        bgmVolume:1,
        effVolume:1,
        aaa:1,
    },

    init:function(){
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },
    //停止bgm
    pauseBgm:function(){
        cc.audioEngine.pause(this.bgmAudioID);
    },
    //停止音效
    pauseEff:function(){
        cc.audioEngine.pause(this.bgmAudioID);
    },
    //播放背景音乐
    play:function(){
        cc.audioEngine.resume(this.bgmAudioID);
    },
    //获取播放的audio
    getUrl:function(url){
        return cc.url.raw("resources/audio/" + url);
    },
    //播放背景音乐
    playBgm:function(url){
        var audioUrl = this.getUrl(url);
        if(this.bgmAudioID != -1){
            return;
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
    },
    // 播放音效
    playEff:function(url){
        var effaudioUrl = this.getUrl(url);
        this.effAudioID = cc.audioEngine.play(effaudioUrl,false,this.effVolume);
    },
    //设置音效
    setEffValue:function(v){
        this.effVolume = v;
    },
    //设置背景音乐
    setBgmValue:function(v){
        this.bgmVolume = v;
    }
    // update (dt) {},
});
