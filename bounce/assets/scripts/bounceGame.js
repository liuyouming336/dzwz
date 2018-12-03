window.mScore = 0;
window.playEff = true;
window.audioMgr = new (require("AudioMgr")) ();
cc.Class({
    extends: cc.Component,

    properties: {
        // 所有boll是否均落下
        bollDown: false,
        // 是否开始游戏
        isBegin: false,
        // 是否在游戏中
        isActivity: false,
        // 第一个boll是否触底
        isFirstBoll: false,
        // 第一个触底的boll X坐标
        firstBollPositionX: 0,

        // 下一次触底的boll x左边
        // nextfirstBollPositionX:0,
        // 所有小球计数
        allBolls: 3,
        // 所有触底小球计数
        tampBolls: 0,
        addBolls: 0,
        level: 1,
        score:0,
        //金币
        lbl_golb:cc.Label,

        _speedNumber:0,

        lastBoxNum:-1,
        //存储游戏box
        panel_box:cc.Node,

        speed:1,

        //是否加速
        _isSpeed:false,
        //已经加速时间
        hasSpeedTime:0,
        // _speedTime:300,

        ishow:false,

        display: cc.Sprite,

        // 标记第一个触底boll的boll
        indexBoll: {
            default: null,
            type: cc.Node,
        },

        boxPrefab: {
            default: [],
            type:[cc.Prefab],
        },

        bollPrefab: {
            default: null,
            type: cc.Prefab,
        },

        lifePrefab: {
            default: [],
            type: cc.Prefab,
        },
        // AdddPrefab: {
        //     default: null,
        //     type: cc.Prefab,
        // },
 
        // 地面
        ground: {
            default: null,
            type: cc.Node
        },

        //结束面板
        overPanel:{
            default:null,
            type:cc.Node,
        },

        // 轨迹条
        ballLink: {
            default: null,
            type: cc.Sprite,
        },

        levelLabel: {
            default: null,
            type: cc.Label,
        },

        allBollsLabel: {
            default: null,
            type: cc.Label,
        },

        // rockAudio: {
        //     default: null,
        //     url: cc.AudioClip,
        // },

        // circleAudio: {
        //     default: null,
        //     url: cc.AudioClip,
        // },

    },

    onLoad () {
        // 开启物理
        cc.director.getPhysicsManager().enabled = true;
        // 开启碰撞
        cc.director.getCollisionManager().enabled = true;

        this.tex = new cc.Texture2D();

        this.overPanel.active = false;
        this.lbl_golb.string = glob;
        //停止播放背景音乐
        audioMgr.pauseBgm();
        
        var self = this;
        this.node.on('addGlob',function(event){
            self.lbl_golb.string = glob;
            event.stopPropagation();
        });
        
        this.indexBoll.setPosition(cc.v2(this.firstBollPositionX, -440));
        this.ballLink.node.setPosition(cc.v2(this.firstBollPositionX, -440));   
        this.ballLink.enabled = false;
        //game  
        this.ground.getComponent('groundSprite').game = this;
        this.initBox();
        this.allBolls = 3;
        this.level = 1;
        //触摸开始  
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            this.touchStart(event);
        }.bind(this), this);
        //触摸移动中
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            this.touchMove(event);            
        }.bind(this), this);
        //触摸结束
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            this.touchEnd(event);
        }.bind(this), this);

        // 生成第一层小球   
        for (var i = 0; i < 6; i++) {
            let isBox = Math.ceil(Math.random() * 10) % 2;
            let boxType = Math.ceil(Math.random() * 10)%3;
            if (isBox == 1) { 
                var newBox = cc.instantiate(this.boxPrefab[boxType]);
                this.panel_box.addChild(newBox);
                newBox.setPosition(-263 + i * (95 + 10), 400);
                var colorArr = this.hslToRgb(this.level * 0.025, 0.5, 0.5);
                newBox.color = cc.color(colorArr[0], colorArr[1], colorArr[2],255);
            }
        }
    },
    //继续按钮
    onBtnAgainClick:function(){
       cc.director.loadScene("bounceGame");
    },
    //分享转发按钮
    onBtnShareClick:function(){
        console.log("分享！");
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.shareAppMessage({
                title:"欢迎来到魔力弹珠王者争霸！",
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
            console.log("平台不支持!");
        }
    },

    // callback:function(){
    //     // console.log(res);
    //     userbutton.hide();
    // },

    initBox: function () {   
        this.level ++;
        // this.levelLabel.getComponent(cc.Label).string = "分数：" + this.score;
        // 下移box
        if (this.isBegin == true) {
            var childrenNode = this.panel_box.children;
            for (var i = 0; i < childrenNode.length; i++) {
                var node = childrenNode[i];
                if (node.name == "boxSprite" || node.name == "lifeBox" || node.name =="sjx" || node.name =="circle" ||node.name == "addCoin") {
                    if (node.position.y <= 450) {
                        var boxy = node.y - 100;
                        if (boxy <= -350) {
                            this.showGameOver();
                        }
                        else{
                            node.y -= 100;
                        }
                    }
                }
            }
            //createBox
            var isShowLifeBox = false;
            var isAddCoin = false;
            for (var i = 0; i < 6; i++) {
                //1 或者 2 
                let isBox = Math.ceil(Math.random() * 10) % 2;
                if (isBox == 1) {
                    let isLife = Math.ceil(Math.random() * 10) % 3;
                    let isAdd = Math.ceil(Math.random() * 10) % 2;
                    if (isLife == true && isShowLifeBox == false) {
                        isShowLifeBox = true;
                        var lifeBox = cc.instantiate(this.lifePrefab[isAdd]);
                        lifeBox.setPosition(-263 + i * (95 + 10), 400);
                        this.panel_box.addChild(lifeBox);
                    }
                    // else if(isAdd == true && isAddCoin == false){
                    //     isAddCoin = true;
                    //     var addBox = cc.instantiate(this.AdddPrefab);
                    //     addBox.setPosition(-263 + i * (95 + 10), 400);
                    //     this.panel_box.addChild(addBox);
                    // } 
                    else {
                        let boxType = Math.ceil(Math.random() * 10)%3;
                        var newBox = cc.instantiate(this.boxPrefab[boxType]);
                        var scoreLabel = newBox.children[0];
                        if(this.level>=20){
                            let isDouble = Math.ceil(Math.random() * 10) % 2;
                            if (isDouble == 1) {
                                scoreLabel.getComponent(cc.Label).string = 2 * this.level;
                            }
                            else {
                                scoreLabel.getComponent(cc.Label).string = this.level;
                            }
                        }
                        else {
                            scoreLabel.getComponent(cc.Label).string = this.level;
                        }
                        this.panel_box.addChild(newBox);
                        newBox.setPosition(-263 + i * (95 + 10), 400);
                        var colorArr = this.hslToRgb(this.level * 0.025, 0.5, 0.5);
                        newBox.color = cc.color(colorArr[0], colorArr[1], colorArr[2],255);
                    }
                }
            }
            this.bollDown = false;
        }
    },
    //消除一行
    onBtnClearOneClick:function(){
        var needGold = glob - 20;
        audioMgr.playEff("clear.mp3");
        if(this._speedNumber>=5){
            alert.show(this.node,"消除次数已用完！");
        }
        else if(needGold<0){
            alert.show(this.node,"金币不足!");
            return;
        }
        else{
            wx.request({
                url:'https://wxxcx.jufoinfo.com/index.php?m=moli&a=use_gold',
                method:'POST',
                data:{
                    openid:uid,
                    gold:20,
                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                },
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                  console.log(res);
                }
            });
            //加速次数 每局比赛最多使用5次
            this._speedNumber+=1;
            //最后每个方块的生成和销毁应该使用对象池
            var childrenNode = this.panel_box.children;
            glob -= 20;
            console.log("aaa");
            var node = childrenNode[0];
            console.log(node);
            if(node){
                if (node.name == "boxSprite" || node.name == "lifeBox" || node.name =="sjx" || node.name =="circle" ) {
                    //在这里判断一下最下面的box是在第几行，便于后面进行消除一行或者几行操作操作
                    var hang = this.checkBoxIsClear(node);
                    for(var j=0;j<childrenNode.length;j++){
                        var clearNode = childrenNode[j];
                        if(Math.round(clearNode.position.y) == (-300)+ 100*hang){
                            clearNode.destroy();
                            this.lbl_golb.string = glob;
                            //这里跟新玩家金币数
                            //cc.sys.localStorage.setItem("golb",glob);
                        }
                    }
                }
            }
        }
    },

    //获取最后一行box在那个位置， 
    checkBoxIsClear:function(node){
        //math.round 求整数
        switch (Math.round(node.position.y)){
            case -300:
                return 0;
            break;
            case -200:   
                 return 1;
            break;
            case -100:
                return 2;
            break;
            case 0:
                return 3;
            break;
            case 100:    
                return 4;
            break;
            case 200:
                return 5;
            break;
            case 300:
                return 6;
            break;
            case 400:
                return 7;
            break;
        }
    },
    //消三行
    // clearThree:function(){
    //     var childrenNode = this.node.children;
    //     for (var i = 0; i < childrenNode.length; i++) {
    //         var node = childrenNode[i];
    //         if (node.name == "boxSprite" || node.name == "lifeBox" || node.name =="sjx" || node.name =="circle" ) {
    //             if(node.node.y<=-150){
    //                 node.node.destory();
    //             }
    //         }
    //     }
    // },
    onBtnAddCicleClick:function(){
        this.lookmovie();
    },
    //加速按钮
    onBtnSpeedClick:function(){
        // if(this._isSpeed){
        //     var newGold = gold - 20;
        //     if(newGold<=0){
        //         cc.alert.show("金币不足！");
        //     }
        //     if(tiem>2){
        // 
        //     }
        // }
        var needGold = glob - 20;
        audioMgr.playEff("clear.mp3");
        if(needGold<0){
            alert.show(this.node,"金币不足!");
            return;
        }
        else{
            this.speed = 2;
            this._isSpeed = true;
            wx.request({
                url:'https://wxxcx.jufoinfo.com/index.php?m=moli&a=use_gold',
                method:'POST',
                data:{
                    openid:uid,
                    gold:20,
                    token:'Yzs4eeWywtV9c8TSxjdlihF8A',
                },
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                    console.log(res);
                }
            });
        }
    // }
    //广告以后再接
    // this.lookmovie();
    },
    //观看广告 以后再接
    lookmovie:function(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            let bannerHeight = 80;
            let bannerWidth = 300;
            this._bannerAd = wx.createBannerAd({
                adUnitId: '', //填写广告id
                style: {
                     left: (winSize.windowWidth-bannerWidth)/2,
                     top: winSize.windowHeight - bannerHeight,
                width: bannerWidth,
                }
            });
            this._bannerAd.show(); //banner 默认隐藏(hide) 要打开
            //微信缩放后得到banner的真实高度，从新设置banner的top 属性
            this._bannerAd.onResize(res => {
                this._bannerAd.style.top = winSize.windowHeight - this._bannerAd.style.realHeight;
            })

            this._bannerAd.onError(err => {
                console.log(err)
            })

            this._bannerAd.onLoad(() => {
                console.log('banner 广告加载成功')
            })
        }
    },
    //开始触摸
    touchStart: function (event) {
        this.ballLink.node.setPosition(cc.v2(this.firstBollPositionX, -440));
    },
    //触摸移动
    touchMove: function(event) {
        if (this.isActivity == false) {
            this.ballLink.enabled = true;
            var touchX = event.touch._point.x -320;
            var touchY = event.touch._point.y;

            //根据手指触摸位置对虚线进行缩放
            // var scaley = touchY/1136;
            // if(scaley>=0.6){
            //     scaley = 0.6; 
            // }
            //
            // else if(scaley<=0.2){
            //     scaley = 0.2; 
            // }
            // this.ballLink.node.scaleY = scaley;
            var rotatAgle = Math.atan(touchX/touchY)* 100;
            this.ballLink.node.setRotation(rotatAgle);
            if (this.ballLink.node.rotation < -90){
                this.ballLink.node.setRotation(-85);
            }
            if (this.ballLink.node.rotation > 90) {
                this.ballLink.node.setRotation(85);
            }
        }
    },
    //让球运动
    bollSport:function(){
        var boll = cc.instantiate(this.bollPrefab);
        this.panel_box.addChild(boll);
        boll.game = this;
        boll.setPosition(cc.v2(this.firstBollPositionX, -440));
        var boxRigidBody = boll.getComponent(cc.RigidBody);
        var angle = this.ballLink.node.rotation;
        //获取球运动的方向
        var toX = Math.sin(angle * 0.017453293) * 100;
        var toY = Math.cos(angle * 0.017453293) * 100;
        boxRigidBody.linearVelocity = cc.v2(toX * 12 * this.speed, toY * 12 * this.speed);
    },
    //触摸结束
    touchEnd: function (event) {
        if (this.isActivity == false) {
            this.ballLink.enabled = false;
            this.allBollsLabel.enabled = false;
            this.indexBoll.active = false;
            if (this.isBegin == false) {
                this.isBegin = true;
            }
            this.schedule(function(){
                this.bollSport();
            }.bind(this), 0.08, this.allBolls - 1)
            // this.schedule(function(){
            //     schedule(function(){
            //       this.firstBall.Active
            // })
            // 
            //     this.isFirstBoll = false;
            // }.bind(this), 0.08 * (this.allBolls - 1), 1);
            this.isActivity = true;
        }
    },
    //收球click
    recyclingBoll:function(){
        audioMgr.playEff("click.mp3");
        this.unschedule(function(){
            this.bollSport();
        })
        var childrenNode = this.panel_box.children;
        for (let i = 0; i < childrenNode.length; i++) {
            var bollnode = childrenNode[i];
            if (bollnode.name == "bollSprite") {
                bollnode.destroy();
            }
        }
        this.bollDown = true;
        this.isActivity = false;
        this.allBolls += this.addBolls;
        this.addBolls = 0;
        this.tampBolls = 0;
        this.indexBoll.active = true;
        this.allBollsLabel.enabled = true;
        this.indexBoll.setPosition(cc.v2(this.firstBollPositionX, -440));
        this.allBollsLabel.getComponent(cc.Label).string = "x " + this.allBolls;
        this.allBollsLabel.node.setPosition(cc.v2(this.firstBollPositionX, -415));
        // this.indexBoll.active = true;
        // this.indexBoll.setPosition(cc.v2(this.nextfirstBollPositionX, -440));
        // this.tampBolls = 10;
    },
    //游戏结束  显示得分
    showGameOver: function () { 
        //播放gameOver音效
        audioMgr.playEff("default.mp3");
        this.ishow = true;
        this.overPanel.active = true;
        mScore = this.score;
        var dataTime = new Date();
        this.overPanel.getChildByName("lbl_score").getComponent(cc.Label).string = this.score;
        // this.overPanel.getLocalZOrder(10000);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //像服务端发送自己得分
            wx.request({
                url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=add_score',
                data: {
                    openid:uid,
                    score:this.score,
                    token:"Yzs4eeWywtV9c8TSxjdlihF8A"
                },
                //第一个 就是到达圆点的距离
                //第二个 就是两个之间的距离
                //第三个 
                method:'POST',
                header:{
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success (res) {
                  console.log(res.data)
                }
            })
            //游戏结束之后发送自己的分数到微信上 作为好友排行榜使用
            wx.postMessage({// 发消息给子域
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score:this.score
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },
    //直接跳过按钮点击事件
    onBtnJumpClick:function(){
        console.log("gameStat"+ gameStat);
        if(gameStat == 0){
            console.log("gameOver");
            cc.director.loadScene("gameOver");
        }
        else if(gameStat==1){
            console.log("ChalgameOver");
            cc.director.loadScene("ChalgameOver");
        }
    },  
    //更新微信子域纹理渲染
    _updateSubDomainCanvas () {
        if (!this.ishow) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
        // let openDataContext = wx.getOpenDataContext();
        // let sharedCanvas = openDataContext.canvas;
        // let canvas = wx.createCanvas();
        // let context = canvas.getContext('2d');
        // context.drawImage(sharedCanvas, 0, 0);
    },
    //开放数据域刷新纹理
    update (dt) {
        // this._updateSubDomainCanvas();
        // var hasSpeedTime = 0;
        if(this._isSpeed){
            this.hasSpeedTime+=dt;
            if(this.hasSpeedTime>=50){
                this._isSpeed = false;
                this.hasSpeedTime = 0;
                this.speed = 1;
            }
        }
        if (this.bollDown == true) {
            this.initBox();
        }

        if(this.isFirstBoll == true && this.isActivity == false){
            //
        }
        // if(this.isFirstBoll == true && this.tampBolls == this.allBolls) {
        //     // this.indexBoll.enabled = true;
        //     this.indexBoll.setPosition(cc.v2(this.firstBollPositionX, -440));
        // }
    },
    //改变颜色  
    hslToRgb: function (h, s, l) {
        var r, g, b;
        if(s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
});
