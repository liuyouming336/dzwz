
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onPauseClick:function(){
        this.node.active = true;
    },

    onLoad () {
        this.node.active = false;  
    },

    start () {
        
    },  
    // 继续游戏
    onBtnPlayClick:function(){
        this.node.active = false;
        // cc.director.placc.director.pause()
        cc.director.resume();
    },

    // update (dt) {},
});
