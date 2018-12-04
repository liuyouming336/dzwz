
cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
        rangItem:cc.Prefab,
        rankItemMe:cc.Prefab,
        scollPanel:cc.Node,
        lbl_msg:cc.Label,
        
    },
    //排行按钮点击事件
    onBtnRankClick:function(){
        this.node.active = true;
        this.lbl_msg.string = "今日排行榜";
        var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            // this.panelRank.active = true;
            // wx.postMessage({// 发消息给子域
            //     messageType: 1,
            //     MAIN_MENU_NUM: "x1"
            // })
            console.log("发送获取玩家信息请求");
            wx.request({
                url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=todaylist_score',
                data: {
                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                },
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                    console.log(res);
                    if(res.data.code==200){
                        console.log("显示玩家排行+ showuserInfo");
                        self.showUserInfo(res.data);
                    }
                    else{
                        console.log(res);
                    }
                },
                fail(err){
                    console.log(err);
                }
            })
        }
         else {
            cc.log("获取玩家排行！");
        }
    },
    //通过玩家openId获取玩家信息
    getUserInfoByOpenid:function(ouid,item){
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
                console.log(res);
                var data = res.data;
                if(data.code==200){
                    //var rankItem = cc.instantiate(self.rangItem);
                    var lblrankname = item.getChildByName("name");
                    if(lblrankname){
                        lblrankname.getComponent(cc.Label).string = data.data.user[0].nickname;
                    }
                    var headurl = data.data.user[0].avatar;
                    // var headurl= "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJNUKAhvG8aPyZg9xlP5nfpHPYlqpYY1ibF6A3T0HLgGAxKQtXwcIukulm3rYPVPyuE5x2zQLHhdkA/132";
                    if(headurl!=null){
                        var headingSpri = item.getChildByName("heading");
                        cc.loader.load({url:headurl, type: 'png'}, function (err, texture) {
                            if(err){
                                console.log(err);
                                return;
                            }
                            var sprite = new cc.SpriteFrame(texture);
                            headingSpri.getComponent(cc.Sprite).spriteFrame = sprite;
                        });
                    }
                    
                    console.log(data);
                    // if()
                    // console.log(data);
                    // self.setGolb(data.data.gold);
                }
                else{
                    console.log(res);
                }
            }
        })
    },  

    //显示排行玩家信息
    showUserInfo:function(data){
        console.log("显示玩家排行!");
        var self = this;
        var result = data.data.result;
        self.content.removeAllChildren();
        // console.log(result);
        // var meRankItem= cc.instantiate(self.meRankItem);
        // self.scollPanel.addChild(meRankItem);
        // meRankItem.y = -480;
        // self.getUserInfoByOpenid(uid,meRankItem);
        //
        if(result!=null){
            console.log("获取我那家openId");
            for(var i=0;i<result.length;i++){
                var rankItem = cc.instantiate(self.rangItem);
                self.content.addChild(rankItem);
                var openID = result[i].openid;
                var lblScore = rankItem.getChildByName("score");
                var lblrankList = rankItem.getChildByName("rank");
                if(openID==uid){
                    var rankItemOfMe = self.scollPanel.getChildByName("itemMe");
                    if(rankItemOfMe == null || rankItemOfMe == undefined){
                        var rankItemOfMe = cc.instantiate(self.rankItemMe);
                        self.scollPanel.addChild(rankItemOfMe);
                    }
                    // var rankItemOfMe = cc.instantiate(self.rankItemMe);
                    rankItemOfMe.y = -480;
                    var mylblScore = rankItemOfMe.getChildByName("score");
                    var lblrankList = rankItemOfMe.getChildByName("rank");
                    if(lblrankList){
                        lblrankList.getComponent(cc.Label).string = i+1;
                    }
                    if(mylblScore){
                        //分数解析不出来 有问题
                        mylblScore.getComponent(cc.Label).string = "100";
                        //result[i].max(score)
                    }
                    self.getUserInfoByOpenid(openID,rankItemOfMe);
                }
                //这个是第一名的时候
                if(i==0){
                    var node = new cc.Node('Sprite');
                    node.parent = rankItem;
                    node.x = -291;
                    var sp = node.addComponent(cc.Sprite);
                    // console.log("第一名");
                    //sp.spriteFrame = this.sprite;
                    cc.loader.loadRes("texture/rank/one", cc.SpriteFrame, function (err, spriteFrame) {
                        node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                }
                //这个是第二名的时候
                if(i==1){
                    var node1 = new cc.Node('Sprite1');
                    node1.parent = rankItem;
                    node1.x = -291;
                    // console.log("第二名");
                    var sp = node1.addComponent(cc.Sprite);
                    //sp.spriteFrame = this.sprite;
                    cc.loader.loadRes("texture/rank/two", cc.SpriteFrame, function (err, spriteFrame) {
                        node1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                }
                //这个是第三名的时候
                if(i==2){
                    var node2 = new cc.Node('Sprite2');
                    node2.parent = rankItem;
                    // console.log("第三名");
                    node2.x = -291;
                    var sp = node2.addComponent(cc.Sprite);
                    //sp.spriteFrame = this.sprite;
                    cc.loader.loadRes("texture/rank/three", cc.SpriteFrame, function (err, spriteFrame) {
                        node2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                }
                else{
                    if(lblrankList){
                        lblrankList.getComponent(cc.Label).string = i+1;
                    }
                }
                //
                if(lblScore){
                    // console.log(result[i]);
                    //这个分数解析不出来 等下进行修改
                    lblScore.getComponent(cc.Label).string = "100";
                    //result[i].max(score)
                }
                self.getUserInfoByOpenid(openID,rankItem);
            }
        }
    },
    //创建节点
    creatNewNode:function(url){
        var node = new cc.Node('Sprite');
        node.parent = rankItem;
        node.x = -291;
        var sp = node.addComponent(cc.Sprite);
        //sp.spriteFrame = this.sprite;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    //显示自己的排行
    showRankofMySelf:function(){

    },
    //昨日排行按钮点击shijian
    onBtnYesTRankClick:function(){
        // self.content.removeAllChildren();
        this.lbl_msg.string = "昨日排行榜";
        var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            // this.panelRank.active = true;
            // wx.postMessage({// 发消息给子域
            //     messageType: 1,
            //     MAIN_MENU_NUM: "x1"
            // })
            //
            //模块化
            //全局变量
            //单例模式
            //
            console.log("发送获取玩家信息请求");
            wx.request({
                url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=yesterdaylist_score',
                data: {
                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                },
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                    console.log(res);
                    if(res.data.code==200){
                        console.log("显示昨日玩家排行+ showuserInfo");
                        self.showUserInfo(res.data);
                    }
                    else{
                        console.log(res);
                    }
                },
                fail(err){
                    console.log(err);
                }
            })
        }
        else {
            //cc.log("");
            console.log("获取玩家排行！");
        }
        cc.log("teste");
    },
        
    // onLoad () {},

    start () {

    },
    // update (dt) {},
});
