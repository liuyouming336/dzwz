
cc.Class({
    extends: cc.Component,

    properties: {
        _isSign:false,
        _HassignDay:0,
        _time:0,
        _isHasData:false,

        panelGift:cc.Node,
        singGiftNum:[],

    },

    // onLoad () {},

    start () {
        this.node.active = false;
        this.singGiftNum =[10,20,30,40,50,60,70];
    },
    //关闭按钮
    onBtnCloseClick:function(){
        this.node.active = false;
    },
    //获取签到信息
    getSignData:function(){
        var self = this;
        var data = new Date();
        var day = data.getDate().toString();
        if(day.length<=1){
            day="0"+day;
        }
        var todayTime = data.getFullYear().toString()+(data.getMonth()+1).toString()+day;
        
        // var todayTime = "20181127";
        // var signData =cc.sys.localStorage.getItem("sign");
        var db = wx.cloud.database(); 
        db.collection('sign').doc(uid).get({
            success: function(res) {
              // res.data 包含该记录的数据
                console.log(res.data);
                var signData = res.data;
                if(signData){
                    this._isSign = signData.isSign;
                    this._HassignDay = signData.allSign;
                    this._time = signData.tiem;
                    if(parseInt(todayTime)>parseInt(this._time))
                    {
                        this._isSign = false;
                        if(parseInt(todayTime)-parseInt(this._time)>=2||this._HassignDay == 7){
                            db.collection('sign').doc(uid).remove({
                                success: console.log,
                                fail: console.error
                              })
                            console.log("这个连续签到边为0!");
                            this._HassignDay = 0;
                            this._isSign = false;
                        }
                    }
                    self.onShowSign(this._HassignDay,this._isSign);
                    console.log(this._isSign + "         " + this._HassignDay + "         "+ this._time);
                    // 
                }
            },
            fail:function(err){
                if(err.errCode == -1){
                    console.log("这个连续签到边为0!");
                    self._HassignDay = 0;
                    self._isHasData = false;
                    self._isSign = false;
                    self.onShowSign(self._HassignDay,self._isSign);
                }
                console.log(err);
            }
        })
    },

    onBtnSingClick:function(){
        var self = this;
        self.getSignData();
        self.node.active = true;
        
    },

    onShowSign:function(allday,issign){
        var self = this;
        self._HassignDay = allday;
        self._isSign = issign;
        console.log("签到天数"+ allday);
        if(allday>0){
            self._isHasData = true;
        }
        for(let i=0;i<self.panelGift.childrenCount;i++){
            var item = self.panelGift.children[i];
            if(item){
                var lbl_coin = item.getChildByName("lbl_coin");
                if(lbl_coin){
                    lbl_coin.getComponent(cc.Label).string = this.singGiftNum[i];
                    item.getChildByName("hasSign").active = false;
                    console.log("签到天数"+ allday);
                    for(var j=0;j<allday;j++){
                        self.panelGift.children[j].getChildByName("hasSign").active = true;
                    }
                }
               
            } 
        }
    },
    //签到界面立刻签到按钮点击事件
    onBtnSignGiftClick:function(){
        console.log(this._isSign);
        if(!this._isSign){
            this.hetSignGift(this._HassignDay);
            var data = new Date();
            var day = data.getDate().toString();
            if(day.length<=1){
                day="0"+day;
            }
            var time = data.getFullYear().toString()+(data.getMonth()+1).toString()+day;
            // time = "20181127";
            this._isSign = true;
            var db = wx.cloud.database(); 
            const table = db.collection('sign');
            if(this._isHasData){
                table.doc(uid).update({
                    data:{
                        tiem:time,
                        isSign:true,
                        allSign:this._HassignDay+1
                    },
                    success: function(res) {
                        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        console.log(res)
                    },
                    fail:function(err){
                        console.log("更新失败"+err)
                    }
                });
            }
            else{
                table.add({
                    data:{
                        _id:uid,
                        tiem:time,
                        isSign:true,
                        allSign:this._HassignDay+1
                    },
                    success: function(res) {
                        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        console.log(res)
                      },
                    fail:function(err){
                        console.log("插入失败"+err)
                    }
                });
            }
        }
        else{
            alert.show(this.node.parent,"你今天已经签到过了!");
            // console.log("你今天已经签到过了!");
        }
    },

    hetSignGift:function(index){
        this.panelGift.children[index].getChildByName("hasSign").active = true;
        // console.log("aaa");
        // console.log(glob+"签到完前的金币!");
        // console.log(this.singGiftNum[index])
        //签到送金币请求
        wx.request({
            url: 'https://wxxcx.jufoinfo.com/index.php?m=moli&a=checkin',
            data: {
               openid:uid,
               coin:this.singGiftNum[index],
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
        glob = parseInt(glob) + this.singGiftNum[index];
        // glob+=
        // console.log(glob+"签到完后的金币!");
        this.node.dispatchEvent(new cc.Event.EventCustom('addGlob', true));
    },

    // update (dt) {},
});
