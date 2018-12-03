
cc.Class({
    extends: cc.Component,

    properties: {
       content:cc.Node,
       invatePrefabs:cc.Prefab,
    },

    // onLoad () {},

    start () {

    },
    //邀请按钮点击的时候
    onBtnInvateClick:function(){
        var self = this;
        this.node.active = true;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.request({
                url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=recommend_users',
                data: {
                //    openid:uid,
                   openid: "ojdYzswpGblgLOoPDH5Zb_vVqyrE",
                   token:'Yzs4eeWywtV9c8TSxjdlihF8A'
                },
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                    console.log(res);
                    self.onShowinvateFriend(res.data);
                }
            })
        }
    },
    //微信平台进行分享
    onBtnShareClick:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.shareAppMessage({
                title:"欢迎来到王者荣耀！",
                imageUrl:"https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJNUKAhvG8aPyZg9xlP5nfpHPYlqpYY1ibF6A3T0HLgGAxKQtXwcIukulm3rYPVPyuE5x2zQLHhdkA/132",
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
    //关闭按钮
    onBtnCloseClick:function(){
        this.node.active = false;
    },

    onShowinvateFriend:function(res){
        var data = res.data;
        var self = this;
        if(data.recommend_users.length>0){
            this.content.removeAllChildren();
            for(var i=0;i<data.recommend_users.length;i++){
                var item = cc.instantiate(this.invatePrefabs);
                self.content.addChild(item); 
                // item.getChildByName("name").getComponent(cc.Label).string = data.recommend_users[i].nickname;
                item.getChildByName("name").getComponent(cc.Label).string = i;
                var heading = item.getChildByName("heading");
                var btn = item.getChildByName("btn_recive");
                //在这里判断玩家是否已经领取了邀请奖励 如果已经领取的话,就把领取按钮设为不可点击
                //这里先注释掉
                // if(isHasGet){
                //     btn.getComponent(cc.Button).interactable = false;
                //     btn.getComponent(cc.Button).enableAutoGrayEffect = true;
                // }
                btn.on('click',function(event){
                    // event.sender.setTag(i);
                    console.log(event);
                    self.onBtnGetGiftClick();
                    event.target.getComponent(cc.Button).interactable = false;
                    event.target.getComponent(cc.Button).enableAutoGrayEffect = true;
                });
                var url = data.recommend_users[i].avatar;
                // var url = "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELqWBt1OZBDAvzG9hvOSlJ0vshJJNA8MBMHicxKDuN5pP9zx9EW3uB9rHvkvax8KbhcDJ3QQThSTdQ/132"
                self.showFriendiMage(url,heading)
                // cc.laod()
            }
        }
    },
    //显示邀请好友的头像
    showFriendiMage:function(headurl,head){
        console.log("显示玩家头像!");
        console.log(head);
        // var sprite;
        cc.loader.load({url:headurl, type:'png'}, function (err, texture) {
            if(err){
                console.log(err);
                return;
            }
            console.log("aaaa");
            var sprite = new cc.SpriteFrame(texture);
            head.getComponent(cc.Sprite).spriteFrame = sprite;
            console.log("bbb");
        });
    },
    //这个是邀请好友奖励按钮触发
    onBtnGetGiftClick:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.request({
                url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=get_gold',
                data: {
                   openid:uid,
                   token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                   gold:50,
                },
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                    console.log(res);
                }
            })
        }
    },
    // update (dt) {},
});
