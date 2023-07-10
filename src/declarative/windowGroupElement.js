import {ViewElement} from "./viewElement";
import {WindowGroup} from "../views/windowGroup";

class WindowGroupElement extends ViewElement {
    constructor() {
        super();
        this.buiView = new WindowGroup();
    }
    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {this.buiView.formatChildrenToWindowChildren()}, 1000);
    }



}

window.customElements.define('bui-windowgroup', WindowGroupElement);

export {WindowGroupElement};