
cc.Class({
    extends: cc.Component,

    properties: {
        first:cc.Node,
        second:cc.Node,
        defeated:cc.Node,
        winner:cc.Node,
    },

    onLoad () {
        this.getChallangeData(uid,this.first);
        this.getChallangeData(changeUid,this.second);
        //判断是否挑战成功来显示相对应的图片
        // if(mScore>changeScore){
        //     this.winner.node.active = true;
        //     this.defeated.node.active = false;
        // }
        // else{
        //     this.winner.node.active = false;
        //     this.defeated.node.active = true;
        // }
    },
     //继续挑战
    onBtnChallangeClick:function(){
        gameStat = 1;
        cc.director.loadScene("bounceGame");
    },
    //不挑战直接开始
    onBtnNoChallangeClick:function(){
        gameStat = 0;
        isshowChall = true;
        cc.director.loadScene("bounceGame");
    },
    test:function(){
        console.log("this is a test");
    },
    //显示挑战者与被挑战着详细信息
    showChallageInfo:function(panel,name,heading,score){
        var self = this;
        panel.getChildByName("lbl_name").getComponent(cc.Label).string = name;
        panel.getChildByName("lbl_score").getComponent(cc.Label).string = score;
        cc.loader.load({url:heading, type: 'png'}, function (err, texture) {
            if(err){
                console.log(err);
                return;
            }
            var sprite  = new cc.SpriteFrame(texture);
            panel.getChildByName("headiing").getComponent(cc.Sprite).spriteFrame = sprite;
        });

        self.defeated.active = (mScore<changeScore?true:false);
        self.winner.active = (mScore>changeScore?true:false);
    },
    //通过uid获取被挑战着玩家信息
    getChallangeData:function(opuid,paneel){
        var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){ 
            wx.request({
                url:'https://wxxcx.jufoinfo.com/index.php?m=moli&a=userdetail',
                data: {
                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                    openid:opuid,
                },
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                    var data = res.data;
                    if(data.code==200){
                        console.log(data);
                        var url = data.data.user[0].avatar;
                        var nickname = data.data.user[0].nickname;
                        // self.lbl_money.string = data.data.user[0].gold;
                        // glob = data.data.user[0].gold;
                        // self.setGolb(data.data.gold);
                        if(opuid == uid){
                           
                            var scoreMe = mScore;
                            self.showChallageInfo(paneel,nickname,url,scoreMe);
                        }
                        else{
                            var score = changeScore;
                            self.showChallageInfo(paneel,nickname,url,score);
                        }
                    }
                    else{
                        console.log(res);
                    }
                }
            })
        }        
    },

    start () {

    },

    // update (dt) {},
});
