window.onload = function(){
    const screen = document.getElementById("screen");
    let windowButtons = []
    let windows = []

    let root = new burdui.View;
    root.setBounds(new burdui.Bounds(0,0,1024,768));

    function onWindowButtonClick() {
        alert("ciao");
    }


    let firstButton = new burdui.Button();
    firstButton.setBounds(new burdui.Bounds(0, 0, 100, 50))
        .setBackgroundColor("transparent")
        .setBorderRounded(10)
        .setBorderColor("#800800")
        .setBorderLineWidth(3)
        .setFont("12px Arial")
        .setText("Finestra 1")
        .setTextColor("#800800")
        .addEventListener(burdui.EventTypes.mouseClick, function(source, args){
            alert("ciao");
        });


    let firstWindow = new burdui.Window();
    firstWindow.setBounds(new burdui.Bounds(0,0, 1024, 768))
        .setBackgroundColor("#99ff99")
        .setBorderColor("#004d00")
        .setBorderLineWidth(3)
        .setChildren(firstButton);

    windowButtons.push(firstButton)
    windows.push(firstWindow)


    //root.addChild(newWindow)
    root.addChild(firstButton)

    const app = new burdui.App(screen, root);
    app.start();

    document.getElementById("repaint").onclick = function() {
        firstButton.setText("Repaint 3");
        firstButton.setBackgroundColor("#d3d3d3");



        firstButton.invalidate(new burdui.Bounds(30, 20, 190, 35));

        app.flushQueue();
    }




};