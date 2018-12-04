
cc.Class({
    extends: cc.Component,

    properties: {
        // panel:cc.Node,
        lbl_name:cc.Label,
        lbl_score:cc.Label,
        heading:cc.Sprite,

    },

    onLoad () {
        // cc.vv = {};
        // cc.vv.challange = this;
        // this.node.active = false;
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
    //测试
    test:function(){
        console.log("this is a test");
    },
    //显示擂主信息
    showChallageInfo:function(name,heading,score){
        var self = this;
        self.lbl_name.string = name;
        self.lbl_score.string = score;
        cc.loader.load({url:heading, type: 'png'}, function (err, texture) {
            if(err){
                console.log(err);
                return;
            }
            var sprite  = new cc.SpriteFrame(texture);
            self.heading.spriteFrame = sprite;
        });
    },
    //通过uid获取被挑战着玩家信息
    getChallangeData:function(ouid){
        var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.request({
                url:'https://wxxcx.jufoinfo.com/index.php?m=moli&a=userdetail',
                data: {
                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                    openid:ouid,
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
                        // console.log(data);
                        var name = data.data.user[0].nickname;
                        var score = changeScore;
                        self.showChallageInfo(name,url,score)
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
