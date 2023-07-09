window.onload = function(){
    let screen = document.getElementById("screen");
    const applicationBounds = new burdui.Bounds(0,0,1024,768);
    let app = null;
    let windowButtons = []
    let windows = []
    let currentId = 0;

    let root = new burdui.View;
    root.setBounds(applicationBounds);


    function changeWindow(buttonClicked){
        root.removeChildById(buttonClicked.getId());
        let selectedWindow = findWindow(buttonClicked.id);
        if(selectedWindow) {
            root.addChild(selectedWindow);
        }
        let newCanvas = document.createElement("canvas");
        newCanvas.id = "screen";
        newCanvas.width = 1024;
        newCanvas.height = 768;
        let parent = screen.parentNode;
        parent.removeChild(screen);
        parent.insertBefore(newCanvas, null);
        screen = newCanvas;
        app = new burdui.App(screen, root);
        app.start();
    }


    function findWindow(id){
        let selectedWindow = null;
        selectedWindow = windows.find((window) => window.id === id);
        return selectedWindow;
    }



    let firstButton = new burdui.Button();
    firstButton.setBounds(new burdui.Bounds(0, 0, 100, 50))
        .setBackgroundColor("transparent")
        .setBorderRounded(10)
        .setBorderColor("#800800")
        .setBorderLineWidth(3)
        .setFont("12px Arial")
        .setText("Finestra 1")
        .setId(currentId)
        .setTextColor("#800800")
        .addEventListener(burdui.EventTypes.mouseClick, function(source, args){
            changeWindow(source);
            app.flushQueue()
        });


    let firstWindow = new burdui.Window();
    firstWindow.setBounds(new burdui.Bounds(0,0, 1024, 768))
        .setBackgroundColor("#99ff99")
        .setBorderColor("#004d00")
        .setBorderLineWidth(3)
        .setId(currentId)
        .setChildren(firstButton);

    windowButtons.push(firstButton);
    windows.push(firstWindow);
    currentId += 1;


    root.addChild(firstWindow)
    root.addChild(firstButton)

    app = new burdui.App(screen, root);
    app.start();

    document.getElementById("repaint").onclick = function() {
        firstButton.setText("Repaint 3");
        firstButton.setBackgroundColor("#d3d3d3");



        firstButton.invalidate(new burdui.Bounds(30, 20, 190, 35));

        app.flushQueue();
    }




};