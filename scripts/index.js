const {ipcRenderer} = require("electron")

window.onload = () => {
    document.querySelector('#Starter').addEventListener('click', ()=>{
        ipcRenderer.send('open-pop-window', null)
    })
}
