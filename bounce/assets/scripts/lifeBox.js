
cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(selfCollider.node.name == "addCoin"){
            //播放音乐
            audioMgr.playEff("addCoin.mp3");
            glob = parseInt(glob) + 1;
            if(cc.sys.platform == cc.sys.WECHAT_GAME){
                wx.request({
                    url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=checkin',
                    data: {
                       openid:uid,
                       coin:1,
                       token:'Yzs4eeWywtV9c8TSxjdlihF8A'
                    },
                    method:'POST',
                    header:{
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    success (res) {
                      console.log(res.data)
                    }
                })
            }
            selfCollider.node.destroy();
            this.node.dispatchEvent(new cc.Event.EventCustom('addGlob', true));
        }
        // if (otherCollider.node.name == "bollSprite") {
            
        // }
    }
});