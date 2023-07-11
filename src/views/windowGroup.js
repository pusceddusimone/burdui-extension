import {View} from "./view";
import {Bounds} from "../layout/bounds";
import {Border} from "../layout/border";
import {Background} from "../layout/background";
import {Window} from "./window";
import {Button} from "./button";

/**
 * Constructor for the WindowGroup
 * @param bounds bounds of the window group
 * @constructor
 */
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

    /**
     * Function to format the initial childs of the windowGroup
     * @param child child of the windowGroup (must be window to be considered)
     */
    formatChildrenToWindowChildren(child){
        if(child.constructor.name === "Window"){
            let firstAvailableIndex = this.findFirstAvailableIndexForWindow();
            child.setId(firstAvailableIndex);
            this.windowMap.push(firstAvailableIndex);
            this.windowChildren.push(child);
        }
    },
    /**
     * Finds the first available index for a newly created window
     * @returns {number} the index for the window
     */
    findFirstAvailableIndexForWindow: function(){
        let windowIndex = 0;
        while (typeof(this.windowMap[windowIndex]) !== "undefined") {
            windowIndex++;
        }
        return windowIndex;
    },

    /**
     * Override to add a child
     * @param child child to add
     * @returns {WindowGroup}
     */
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

    /**
     * Function to paint the children of the windowGroup
     * @param g the canvas
     * @param b the root of the windowgroup
     */
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

    /**
     * Function to switch to a new window
     * @param id the id of the window
     */
    changeWindow: function(id){
        if(id == null)
            return;
        this.selectedWindow = id;
        let screen = document.getElementById('screen').getContext('2d');
        let root = document.getElementById('window1').buiView;
        this.resetWindow(document.getElementById('screen'));
        this.paint(screen, root);
    },


    /**
     * Function to clean the window, used when we switch to a new one
     * @param screen screen to clean
     */
    resetWindow: function (screen){
        let rect = screen.getBoundingClientRect();
        let x = rect.left;
        let y = rect.top;
        let context = screen.getContext('2d');
        context.clearRect(x-3,y-3,context.canvas.width-this.border.lineWidth-10,context.canvas.height-this.border.lineWidth-10);
    },


    /**
     * Adds a new page when we click to the '+' button
     */
    addPage: function(){
        let newIndex = this.findFirstAvailableIndexForWindow();
        let newWindow = new Window();
        newWindow.setBounds(new Bounds(0,0,this.bounds.w,this.bounds.h-50));
        newWindow.setId(newIndex);
        this.windowChildren.push(newWindow);
        this.windowChildren.push();
        this.addChild(newWindow);
        this.windowMap.push(newIndex);
        let screen = document.getElementById('screen').getContext('2d');
        let root = document.getElementById('window1').buiView;
        this.paint(screen, root);
        this.changeWindow(newIndex);
    },

    /**
     * Removes a page when we click on the corresponding 'X' button
     * @param id id of the window to remove
     */
    removePage: function(id){
        let newWindows = this.windowChildren.filter(window => window.getId() !== id);
        let newSelected = this.windowMap.indexOf(id);
        this.selectedWindow = this.windowMap[newSelected-1] ? this.windowMap[newSelected-1] : 0;
        let newMap = this.windowMap.filter(mapId => mapId !== id);
        this.windowChildren = newWindows;
        this.windowMap = newMap;
        let screen = document.getElementById('screen').getContext('2d');
        let root = document.getElementById('window1').buiView;
        this.removeChildren();
        this.paint(screen, root);
        this.changeWindow(this.selectedWindow);
    },

    /**
     * Function to add as childs the tabs to switch windows
     * @param tabsWidth width of the tab
     * @param tabsHeight height of the tab
     * @param xButtonWidth width of the x button
     */
    getTabsOfWindows: function(tabsWidth = 120, tabsHeight = 40, xButtonWidth = 20){
        let windowGroupBounds = this.getBounds();
        let currentWidth = 0;
        for(let window of this.windowChildren){ //For each window children
            let button = new Button();
            let backgroundColor = "white";
            if(window.getId() === this.selectedWindow) //If selected window change color to red
                backgroundColor = "red";
            //Generic tab button of a window
            button.setBounds(new Bounds(windowGroupBounds.x+currentWidth,windowGroupBounds.y+1, tabsWidth, tabsHeight)).setBackgroundColor(backgroundColor)
                .setBorderColor("#004d00")
                .setBorderLineWidth(3)
                .setFont("16px Arial")
                .setText("Finestra " + (window.getId()))
                .setTextColor("#004d00")
                .setId(window.getId())
                .addEventListener(burdui.EventTypes.mouseClick, (source) => {this.changeWindow(source.getId())});
            let closeWindowButton = new Button(); //X button to close a window
            closeWindowButton.setBounds(new Bounds(windowGroupBounds.x+currentWidth+tabsWidth-xButtonWidth,windowGroupBounds.y+1, xButtonWidth, tabsHeight)).setBackgroundColor("white")
                .setBorderColor("#004d00")
                .setBorderLineWidth(3)
                .setFont("16px Arial")
                .setText("X")
                .setTextColor("#004d00")
                .setId(window.getId())
                .addEventListener(burdui.EventTypes.mouseClick, (source) => {this.removePage(source.getId())});
            currentWidth += tabsWidth;
            this.addChild(button);
            this.addChild(closeWindowButton);
        }
        //Button to add a new page
        let buttonNewPage = new Button();
        buttonNewPage.setBounds(new Bounds(windowGroupBounds.x+currentWidth-1,windowGroupBounds.y+1, 30, 40)).setBackgroundColor("white")
            .setBorderColor("#004d00")
            .setBorderLineWidth(3)
            .setFont("16px Arial")
            .setText("+")
            .setTextColor("#004d00")
            .addEventListener(burdui.EventTypes.mouseClick, () => { this.addPage()});
        this.addChild(buttonNewPage);
    },


    /**
     * Override of the paint function
     * @param g the canvas
     * @param r the root
     */
    paint: function(g, r){
        this.getTabsOfWindows(); //Adds the tabs as children
        r = r || this.bounds;
        this.border.paint(g, r);
        this.paintChildren(g, r);
    },
});

export {WindowGroup};