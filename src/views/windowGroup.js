import {View} from "./view";
import {Bounds} from "../layout/bounds";
import {Border} from "../layout/border";
import {Background} from "../layout/background";
import {Window} from "./window";
import {Button} from "./button";

function WindowGroup(bounds){
    View.call(this);
    this.bounds = bounds || new Bounds();
    this.border = new Border();
    this.background = new Background();
    this.windowChildren = [];
    this.selectedWindow = 0;
    this.windowMap = [];

}


WindowGroup.prototype = Object.assign( Object.create( View.prototype ), {

    constructor: WindowGroup,

    setBounds: function(bounds){
        this.bounds = bounds;
        this.border.setBounds(new Bounds(0,0, this.bounds.w, this.bounds.h));
        this.background.setBounds(new Bounds(
            this.border.lineWidth/2,
            this.border.lineWidth/2,
            this.bounds.w - this.border.lineWidth,
            this.bounds.h - this.border.lineWidth));
        this.updateBounds();
        return this;
    },

    getBounds : function(){
        return this.bounds;
    },

    formatChildrenToWindowChildren(child){
        if(child.constructor.name === "Window"){
            let firstAvailableIndex = this.findFirstAvailableIndexForWindow();
            child.setId(firstAvailableIndex);
            this.windowMap.push(firstAvailableIndex);
            this.windowChildren.push(child);
        }
    },

    findFirstAvailableIndexForWindow: function(){
        let index = 0;
        while(true){
            if(!(index in this.windowMap))
                return index;
            index +=1;
        }
    },


    addChild: function(child){
        View.prototype.addChild.call(this, child);

        // not optimized, we can speed-up setting the bounds of the last child.
        this.updateBounds();

        return this;
    },

    updateBounds: function(){
        let next = 0;
        for(let i in this.children) {
            let c = this.children[i];
            switch(this.style){
                case "vertical":
                    c.setBounds(new Bounds(0, next, this.bounds.w, c.bounds.h));
                    next += c.bounds.h + this.padding;
                    break;

                case "horizontal":
                    c.setBounds(new Bounds(next, 0, c.bounds.w, this.bounds.h));
                    next += c.bounds.w + this.padding;
                    break;
            }
        }
    },

    paintSelectedWindow: function(){
        if(this.windowChildren[this.selectedWindow]){
            let screen = document.getElementById('screen').getContext('2d');
            let root = document.getElementById('window1').buiView;
            this.windowChildren[this.selectedWindow].paint(screen, root);
        }
    },

    paintChildren: function (g, b){
        let r = b || this.bounds;
        for(let c of this.children){
            if(c.constructor.name === "Window" && this.selectedWindow !== c.getId())
                continue;
            let intersection = c.bounds.intersection(r);
            if(intersection.w > 0 && intersection.h > 0){
                g.save();
                g.translate(c.bounds.x, c.bounds.y);
                intersection.setX(intersection.x - c.bounds.x);
                intersection.setY(intersection.y - c.bounds.y);
                c.paint(g, intersection);
                g.restore();
            }
        }
    },

    changeWindow: function(id){
        if(id == null)
            return;
        this.selectedWindow = id;
        let screen = document.getElementById('screen').getContext('2d');
        let root = document.getElementById('window1').buiView;
        this.resetWindow(document.getElementById('screen'));
        this.paint(screen, root);
    },

    resetWindow: function (screen){
        let rect = screen.getBoundingClientRect();
        let x = rect.left;
        let y = rect.top;
        let context = screen.getContext('2d');
        context.clearRect(x,y,context.canvas.width-this.border.lineWidth-10,context.canvas.height-this.border.lineWidth-10);
    },


    addPage: function(){
        this.selectedWindow += 1;
        let newWindow = new Window();
        newWindow.setBounds(new Bounds(0,0,this.bounds.w,this.bounds.h-50));
        this.removeChildren();
        this.windowChildren.push(newWindow);
        this.windowChildren.push();
        this.addChild(newWindow);
        let screen = document.getElementById('screen').getContext('2d');
        let root = document.getElementById('window1').buiView;
        this.paint(screen, root);
    },

    getTabsOfWindows: function(tabsWidth = 120, tabsHeight = 40, xButtonWidth = 20){
        let windowGroupBounds = this.getBounds();
        let currentWidth = 0;
        let index = 0;
        for(let window of this.windowChildren){
            let button = new Button();
            button.setBounds(new Bounds(windowGroupBounds.x+currentWidth,windowGroupBounds.y+1, tabsWidth, tabsHeight)).setBackgroundColor("white")
                .setBorderColor("#004d00")
                .setBorderLineWidth(3)
                .setFont("16px Arial")
                .setText("Finestra " + (index+1))
                .setTextColor("#004d00")
                .setId(window.getId())
                .addEventListener(burdui.EventTypes.mouseClick, (source) => {this.changeWindow(source.getId())});
            let closeWindowButton = new Button();
            closeWindowButton.setBounds(new Bounds(windowGroupBounds.x+currentWidth+tabsWidth-xButtonWidth,windowGroupBounds.y+1, xButtonWidth, tabsHeight)).setBackgroundColor("white")
                .setBorderColor("#004d00")
                .setBorderLineWidth(3)
                .setFont("16px Arial")
                .setText("X")
                .setTextColor("#004d00")
                .setId(window.getId())
                .addEventListener(burdui.EventTypes.mouseClick, (source) => {});
            currentWidth += tabsWidth;
            this.addChild(button);
            this.addChild(closeWindowButton);
            index += 1;
        }
        let buttonNewPage = new Button();
        buttonNewPage.setBounds(new Bounds(windowGroupBounds.x+currentWidth-1,windowGroupBounds.y+1, 50, 40)).setBackgroundColor("white")
            .setBorderColor("#004d00")
            .setBorderLineWidth(3)
            .setFont("16px Arial")
            .setText("+")
            .setTextColor("#004d00")
            .addEventListener(burdui.EventTypes.mouseClick, () => { this.addPage()});
        this.addChild(buttonNewPage);
    },


    paint: function(g, r){
        this.getTabsOfWindows();
        r = r || this.bounds;
        this.border.paint(g, r);
        this.paintChildren(g, r);
    },
});

export {WindowGroup};