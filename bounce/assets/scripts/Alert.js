
cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    // onLoad () {},

    start () {

    },

    show:function(parent,msg){
        var newNode ;
        cc.loader.loadRes("Prefabs/alert", function (err, prefab) {
            newNode = cc.instantiate(prefab);
            newNode.getChildByName("msg").getComponent(cc.Label).string = msg;
            newNode.setPosition(cc.v2(0, 0));
            parent.addChild(newNode);
        });

        this.scheduleOnce(function(){
            newNode.removeFromParent(false);
        },2)
    },

    // update (dt) {},
});
