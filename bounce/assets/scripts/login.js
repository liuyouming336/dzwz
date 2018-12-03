var userbutton;
var db;
window.uid = -1;
window.glob = 10;
window.gameStat = 0;
window.changeUid = 0;
window.changeScore = 0;
window.changeTime = 0;
window.invatOpenid = 0;
window.isPlayBg = true;
window.alert = new (require("Alert")) ();

cc.Class({
    extends: cc.Component,

    properties: {
       panelRank:cc.Node,
       panelChallange:cc.Node,
       isPlayAudio:true,
       headImg:cc.Sprite,
       lblName:cc.Label,
       lbl_money:cc.Label,
       rule_panel:cc.Node,
       surpr_panel:cc.Node,

       sprViose:cc.Sprite,
    },

    onLoad () {
        //获取用户的openID；
        this.getOpenId();
        var self = this;
        this.node.on('addGlob',function(event){
            event.stopPropagation();
            console.log("aaaa");
            self.test();
        });
         //播放背景音乐
        audioMgr.playBgm("bg.mp3");
        //显示音乐播放按钮图片显示
        this.showSetting()
        this.headImg.node.active = false;
        this.rule_panel.active = false;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            console.log("aaaaa00");
            var shareDat = wx.getLaunchOptionsSync().query;
            console.log(shareDat);
            //待会记得打开
            if(shareDat.data!=null&&shareDat.data!=undefined){
                //gameStat  0正常游戏界面 1 战斗游戏界面
                //通过玩家最开始进入获取share中的query字段  如果有  就是好友邀请战斗
                //
                gameStat = shareDat.gameStat;
                if(gameStat == 1){
                    changeUid = shareDat.uid;
                    changeScore = shareDat.score;
                    changeTime = shareDat.time;
                }
                else{
                    invatOpenid = shareDat.uid;
                }
            }
            console.log(gameStat + "gameStat");
        }
        // gameStat 0 正常游戏模式  1 挑战游戏模式
        if(gameStat == 1){
            console.log("挑战模式");
            this.panelChallange.active = true;
            var challange = this.panelChallange.getComponent("challangeFri");
            challange.getChallangeData(changeUid);
        }
    },
    //惊喜按钮
    onBtnSurClick:function(){
        this.surpr_panel.active = true;
    },
    //惊喜关闭按钮
    onBtnSurCloseClick:function(){
        this.surpr_panel.active = false;
    },
    //获取用户的openid
    getOpenId:function(){
        var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.cloud.init({
                env: 'game-d0c4e1'
            });
            wx.cloud.callFunction({
                name: 'login',
                complete: res => {
                  console.log(res);
                  console.log('callFunction test result: ', res.result.userInfo.openId);
                  uid = res.result.userInfo.openId;
                  self.onGetUserInfo(); 
                }
            })
            db = wx.cloud.database();
        }
    },

    test:function(){
        // var self = this;
        this.lbl_money.string = glob;
        console.log("增加金币！"+ glob);

        // db.collection('userData').doc(uid).update({
        //     data: {
        //         // 表示指示数据库将字段自增 10
        //         coin: glob
        //       },
        //     success: function(res) {
        //       // res.data 包含该记录的数据
        //     }
        // })
    },
    start () {
       
        // this.lbl_money.string = glob;
    },
    //获取用户信息
    onGetUserInfo:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            console.log("aaaaaaaaaaa");
            console.log(wx.getSystemInfoSync());

            wx.getSetting({
                success:(res)=>{
                    if(res.authSetting["scope.userInfo"]){
                        console.log("已经进行过微信授权，不必重新授权！");
                        this.headImg.node.active = true;
                        this.scheduleOnce(function(){
                            this.showUserInfo();
                        },0.5)
                        // cc.director.loadScene("bounceGame");
                    }
                    else
                    {
                        userbutton = wx.createUserInfoButton({
                            type: 'text',
                            text: '授权',
                            style: {
                                left:wx.getSystemInfoSync().windowWidth*0.5 - 50,
                                top:wx.getSystemInfoSync().windowHeight*0.5,
                                width: 100,
                                height: 40,
                                lineHeight: 40,
                                backgroundColor: '#1F9741',
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 20,
                                borderRadius: 4
                            }
                        });
                        userbutton.onTap((res) => {
                            console.log(res);
                            userbutton.hide();
                            var data = res.userInfo;
                            if(invatOpenid){
                                //说明是有别人邀请进来的  然后就把这个id加到自己邀请的id
                                // invatOpenid = 
                            }
                            wx.request({
                                url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=usercheck',
                                data: {
                                    openid:uid,
                                    nickName:data.nickName,
                                    avatarUrl:data.avatarUrl, 
                                    coin:10,
                                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                                    reopenid:invatOpenid,
                                },
                                method:'POST',
                                header:{
                                    'content-type': 'application/x-www-form-urlencoded',
                                },
                                success (res) { 
                                    console.log("用户接口");
                                    console.log(res);
                                }
                            })
                            //云开发不要 直接注释 直接连接后台接口
                            // const db = wx.cloud.database();
                            // const table = db.collection('userData');
                            // table.add({
                            //     data:{
                            //         _id:uid,
                            //         name:data.nickName,
                            //         heading:data.avatarUrl, 
                            //         coin:10,
                            //     },
                            //     success: function(res) {
                            //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                            //         console.log(res)
                            //         // uid = res._id;
                            //       }
                            //     // data:JSON.stringify(res.userInfo),
                            // });
                            this.onGetUserInfo();
                            // cc.director.loadScene("bounceGame");
                        })
                    }
                }
            })
        }
    },
    //开始游戏
    onLoginClick:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.getSetting({
                success:(res)=>{
                    if(res.authSetting["scope.userInfo"]){
                        console.log("已经进行过微信授权，不必重新授权！");
                        cc.director.loadScene("bounceGame");
                    }
                    else
                    {
                        alert.show(this.node,"请先进行授权!");
                    }
                }
            })
        }
        else{
            cc.director.loadScene("bounceGame");
        }  
    },
    //关闭按钮
    onBtnCloseClick:function(){
        this.rule_panel.active = false;
    },

    onBtnRuleClick:function(){
        this.rule_panel.active = true;
    },
    //刷新金币数
    // setGolb:function(money){
    //     console.log("设置金币!");
    //     glob = money;
    //     console.log("glob 的值是" + glob);
    // },
    showUserInfo:function(){
        var self = this;
        //查找数据中是否有玩家数据,有就显示 否则就存储
        console.log("我的uid是：" + uid);
        wx.request({
            url:'https://wxxcx.jufoinfo.com/index.php?m=moli&a=userdetail',
            data: {
                token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                openid:uid,
            },
            method:'POST',
            header:{
                'content-type': 'application/x-www-form-urlencoded',
            },
            success (res) {
                var data = res.data;
                if(data.code==200){
                    console.log(data);
                    // if()
                    //等下改回来 变为自己的头像地址
                    var url = data.data.user[0].avatar;
                    // var url = "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJNUKAhvG8aPyZg9xlP5nfpHPYlqpYY1ibF6A3T0HLgGAxKQtXwcIukulm3rYPVPyuE5x2zQLHhdkA/132";
                    cc.loader.load({url:url, type: 'png'}, function (err, texture) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        var sprite  = new cc.SpriteFrame(texture);
                        self.headImg.spriteFrame = sprite;
                    });
                    // console.log(data);
                    self.lblName.string = data.data.user[0].nickname;
                    self.lbl_money.string = data.data.user[0].gold;
                    glob = data.data.user[0].gold;
                    // self.setGolb(data.data.gold);
                }
                else{
                    console.log(res);
                }
            }
        })

        // db.collection('userData').doc(uid).get({
        //     success: function(res) {
        //       // res.data 包含该记录的数据
        //      console.log("获取查询数据!");
        //      console.log(res.data); 
        //      var url = res.data.heading;
        //      cc.loader.load({url:url, type: 'png'}, function (err, texture) {
        //          if(err){
        //              console.log(err);
        //              return;
        //          }
        //          var sprite  = new cc.SpriteFrame(texture);
        //          self.headImg.spriteFrame = sprite;
        //      });
        //      self.lblName.string = res.data.name;
        //      self.lbl_money.string = res.data.coin;
        //      console.log("开始前"+glob);
        //      glob = res.data.coin;
        //      console.log("开始后"+glob);
        //      self.setGolb(res.data.coin);
        //     //  self.test(glob);
        //     }
        // })
        //如果uid没有获取到，直接重复这个流程
        // if(uid == -1){
        //     self.showUserInfo();
        // }

        // var self = this;
        // var data = cc.sys.localStorage.getItem("userData");
        // if(data){
        //     data =JSON.parse(data);
        //     console.log("用户信息");
    
        // }
        // else{
        //     userbutton.onTap((res) => {
        //         userbutton.hide();
        //         var userinfo = cc.sys.localStorage.getItem("userData");
        //         if(userinfo){
        //             console.log("已经有用户信息!");
        //         }
        //         else{
        //             cc.sys.localStorage.setItem("userData",JSON.stringify(res.userInfo));
        //             this.onGetUserInfo();
        //         }
        //     })
        // }
    },
    
    //邀请好友
    onBtnSahreClick:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.shareAppMessage({
                title:"欢迎来到王者荣耀！",
                imageUrl:"https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJNUKAhvG8aPyZg9xlP5nfpHPYlqpYY1ibF6A3T0HLgGAxKQtXwcIukulm3rYPVPyuE5x2zQLHhdkA/132",
                query:"name=111&age=12",
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
  
    //排行
    onBtnRankClick:function(){
        
    },

    onBtnCloseRankClick:function(){
        this.panelRank.active = false;
    },
    //是否播放音乐
    onBtnAudioClick:function(){
        var self = this;
        if(self.isPlayAudio){
            // pauseEff
            cc.loader.loadRes("texture/pause/closeBG", cc.SpriteFrame, function (err, spriteFrame) {
                self.sprViose.spriteFrame = spriteFrame;
            });
            self.isPlayAudio = !self.isPlayAudio;
            //设置声音为0
            // audioMgr.setBgmValue(0);
            audioMgr.pauseBgm();
            isPlayBg = false;
        }
        else{
            // cc.audioEngine.resume();
            audioMgr.play();
            isPlayBg = true;
            cc.loader.loadRes("texture/login/setting", cc.SpriteFrame, function (err, spriteFrame) {
                self.sprViose.spriteFrame = spriteFrame;
            });
            self.isPlayAudio = !self.isPlayAudio;
        }
    },
    //显示音效按钮显示图标
    showSetting:function(){
        var self= this;
        if(isPlayBg){
            audioMgr.play();
        }
        else{
            cc.loader.loadRes("texture/pause/closeBG", cc.SpriteFrame, function (err, spriteFrame) {
                self.sprViose.spriteFrame = spriteFrame;
            });
            self.isPlayAudio = false;
            audioMgr.pauseBgm();
            // self.isPlayAudio = !self.isPlayAudio;
        }
    }

    // update (dt) {},
});
