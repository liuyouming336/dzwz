
cc.Class({
    extends: cc.Component,

    properties: {
        _ishow:false,
        sprViose:cc.Sprite,
    },

    onBtnPauseClick:function(){
        // this.ishow = !this.ishow;
        this.node.active = true;
        this.showVideoSetting();
        // cc.director.pause();
    },

    //onLoad () {},
    //关闭声音点击
    onBtnCloseVoiClick:function(){
        var self = this;
        if(!self._ishow){
            // pauseEff
            cc.loader.loadRes("texture/pause/close2", cc.SpriteFrame, function (err, spriteFrame) {
                self.sprViose.spriteFrame = spriteFrame;
            });
            self._ishow = !self._ishow;
            //设置声音为0
            playEff = false;
            audioMgr.setEffValue(0);
        }
        else{
            // cc.audioEngine.resume();
            audioMgr.setEffValue(1);
            playEff = true;
            cc.loader.loadRes("texture/pause/close", cc.SpriteFrame, function (err, spriteFrame) {
                self.sprViose.spriteFrame = spriteFrame;
            });
            self._ishow = !self._ishow;
        }
    },
    //继续游戏 
    onBtnContiueClick:function(){
        cc.director.resume();
        this.node.active = false;
    },
    //返回首页  
    backToSY:function(){
        // cc.director.resume();
        cc.director.loadScene("login");
    },
    //开始新的游戏
    newGame:function(){
        // cc.director.resume();
        cc.director.loadScene("bounceGame");
    },
    //显示音乐按钮显示图标
    showVideoSetting:function(){
        var self = this;
        if(playEff){
            audioMgr.setEffValue(1);
        }
        else{
            audioMgr.setEffValue(0);
            cc.loader.loadRes("texture/pause/close2", cc.SpriteFrame, function (err, spriteFrame) {
                self.sprViose.spriteFrame = spriteFrame;
            });
            self._ishow = true;
        }
    },

    start () {

    },

    // update (dt) {},
});
