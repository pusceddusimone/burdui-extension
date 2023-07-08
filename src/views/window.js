import {View} from "./view";
import {Bounds} from "../layout/bounds";
import {Border} from "../layout/border";
import {Background} from "../layout/background";
import {Text} from "../layout/text";

function Window(bounds){
    View.call(this);
    this.bounds = bounds || new Bounds();
    this.border = new Border();
    this.background = new Background();
    this.children = null;
}


Window.prototype = Object.assign( Object.create( View.prototype ), {

    constructor: Window,

    setBounds: function(bounds){
        this.bounds = bounds;
        this.border.setBounds(new Bounds(0,0, this.bounds.w, this.bounds.h));
        this.background.setBounds(new Bounds(
            this.border.lineWidth/2,
            this.border.lineWidth/2,
            this.bounds.w - this.border.lineWidth,
            this.bounds.h - this.border.lineWidth));
        return this;
    },

    getBounds : function(){
        return this.bounds;
    },


    setChildren : function(children){
        this.children = children;
        return this;
    },

    getChildren : function(){
        return this.children
    },



    paint: function(g, r){
        r = r || this.bounds;
        this.border.paint(g, r);
        this.children.paint(g, r);
    },
});

export {Window};