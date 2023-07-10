import {ViewElement} from "./viewElement";
import {WindowGroup} from "../views/windowGroup";

class WindowGroupElement extends ViewElement {
    constructor() {
        super();
        this.buiView = new WindowGroup();
    }
    connectedCallback() {
        let firstCallback = true;
        super.connectedCallback(() => {
            if(firstCallback){
                this.buiView.formatChildrenToWindowChildren();
                firstCallback = false;
            }
        });
        //setTimeout(() => {this.buiView.formatChildrenToWindowChildren()}, 1000);
    }



}

window.customElements.define('bui-windowgroup', WindowGroupElement);

export {WindowGroupElement};