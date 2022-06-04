const {shell, ipcRenderer} = require("electron");
const fs = require('fs');
const {exec} = require("child_process");

import config from "../config.js";

const closeImg = config.closeImg
const openImg =  config.openImg
const popMouth = document.querySelector('#pop-voice');

function adjust() {
    let appDom = document.querySelector('#app')
    let popCat = document.querySelector('#pop-cat')
    appDom.style.height = `${window.innerHeight}px`
    popCat.style.height = `${window.innerHeight - 20}px`
}

const popCat = document.querySelector('#pop-cat')

// interface - implement open recycleBinDirection
function OpenRecycleBinDirectory() {
    exec('start shell:recyclebinfolder');
}



window.onresize = adjust
window.onload = () => {
    // 调整页面结构
    adjust()
    // init
    init()

    let times = 0
    let exec = require('child_process').exec
    let timer = null
    let eatTimer = null
    let blockClick = false
    let blockClickTimer = null

    // interface - implement pop cat open/close mouth
    function popClose() {
        popCat.src = closeImg
    }
    function popOpen() {
        popCat.src = openImg
    }
    // pop cat eat
    function popEat() {
        let flag = false
        if (eatTimer != null) {
            stopEat()
            return
        }
        eatTimer = setInterval(()=>{
            if (flag) popOpen()
            else popClose()
            flag = !flag
        }, 50);
    }
    // pop cat stop eat
    function stopEat() {
        if (eatTimer != null) {
            window.clearInterval(eatTimer)
            eatTimer = null
            popClose()
        }
    }
    // open mouth, wait delay milliseconds, close mouth
    function popOpenAutoClose(delay) {
        popOpen()
        if (timer != null) {
            window.clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            popClose()
            timer = null
        }, delay);
    }
    // when drag file over it
    popCat.addEventListener('dragover', (ev)=>{
        ev.preventDefault()
        ev.stopPropagation()
        // times++
        // if (times > 30) {
        //     popEat()
        // }
        // popOpen()
        popOpenAutoClose(200);
    })
    // when do drop the file
    popCat.addEventListener('drop', (ev)=>{
        ev.preventDefault()
        ev.stopPropagation()
        // move all file to recycleBinDirectory
        let fl = ev.dataTransfer.files
        for (let i = 0; i < fl.length; i++) {
            ipcRenderer.send('del-to-recycle', fl[i].path)
            stopEat()
        }
        popMouth.play()
    })
    // open the recycleBinDirectory
    popCat.addEventListener('click', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        // prevent multiple open
        if (blockClick === true) {
            return
        }
        blockClick = true
        OpenRecycleBinDirectory()
        if (blockClickTimer == null) {
            blockClickTimer = setTimeout(()=>{
                blockClick = false
                blockClickTimer = null
            }, 1000)
        }
    })
    // init
    function init() {
        popClose()
        popMouth.src = config.popVoice
    }
    console.log("成功加载脚本")
    new Notification('启动OK', {
        icon: closeImg,
        body: '加载pop-cat成功',
        silent: true
    })
    popMouth.play()
}
