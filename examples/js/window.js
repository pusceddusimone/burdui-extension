window.onload = function(){
    let screen = document.getElementById("screen");
    let app = null;
    app = new burdui.App(screen, document.getElementById("window1").buiView);
    app.start();
};