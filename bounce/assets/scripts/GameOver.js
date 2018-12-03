cc.Class({
    extends: cc.Component,

    properties: {
       lbl_score:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lbl_score.getComponent(cc.Label).string = mScore;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1",
                score:this.score
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },
    //再来一次
    onBtnAgainClick:function(){
        cc.director.loadScene("bounceGame");
    },
    //返回大厅
    onBtnBackToLogin:function(){
        cc.director.loadScene("login");
    },
    //好友助力
    onBtnShareClik:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.shareAppMessage({
                title:"我在魔力弹珠获得"+ mScore + "分，快来祝我一臂之力！",
                imageUrl:canvas.toTempFilePathSync({
                    destWidth: 500,
                    destHeight: 400
                  }),
                  query:"uid="+uid,
                success(res){
                    console.log("转发成功！");
                },
                fail(res){
                    console.log("转发失败！");
                }
            })
        }
        else{
            console.log("平台不支持分享!");
        }
    },  

    //发起挑战
    onChallangeClick:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            var time = new Date().getTime();
            wx.shareAppMessage({
                title:"我在魔力弹珠中获得"+ mScore + "分，快来挑战我吧！", 
                imageUrl:canvas.toTempFilePathSync({
                    destWidth: 500,
                    destHeight: 400
                  }),
                  query:"gameStat=1&uid="+uid + "&score=" + mScore + "&time="+time,
                    
                success(res){
                    console.log("转发成功！");
                },
                fail(res){
                    console.log("转发失败！");
                }
            })
        }
        else{
            console.log("平台不支持分享!");
        }
    },
    start () {

    },

    // update (dt) {},
});
