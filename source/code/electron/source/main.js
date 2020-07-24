const {app, BrowserWindow, ipcMain, shell, clipboard} = require("electron")
const fs = require("fs")
const path = app.getPath("userData") + "/zoomLinksConfig.txt"

/* ////////////////////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////////////// */
function getDate() {
    let date = new Date()

    return {
        today: (date.getDay() - 1),
        time: (date.getHours() * 100) + (date.getMinutes())
    }
}

function createConfigFile(content) {
    fs.writeFile(path, content, (err) => {
        console.log(err)
    })
}

function checkConfig() {
    let content = ""
    let contentArray = []

    try {
        content = fs.readFileSync(path,"utf8")
        contentArray = content.split(",")
    } catch (e) {
        createConfigFile("")
        if (e instanceof Object) {
            console.log(app.getPath("userData"))
            createConfigFile("")
        } else {
            console.error(typeof e)
        }
    }
    
    return contentArray
}

function checkSchedule(event, data) {
    let response
    let date = getDate()
    let content = checkConfig()
    let subjectsInSchedule = []
    let schedule = data.Horarios
    
    for (let i = 0; i < schedule[date.today].length; i++) {
        if (schedule[date.today][i].Inicio < date.time && schedule[date.today][i].Final > date.time) {
            if (content.includes(schedule[date.today][i].Codigo)) {
                subjectsInSchedule.push(schedule[date.today][i])
            }          
        }
    }
    
    if (subjectsInSchedule.length == 0) {
        if (content == "") {
            response = "no-selected-subjects"
        } else {
            response = "zero-subjects"
        }

    } else if (subjectsInSchedule.length == 1) {
        response = "one-subject"

    } else {
        response = "multiple-subjects"
    }   

    event.reply(response, subjectsInSchedule, data)   
}

function onAllWindowsClosed() {
    if (process.platform !== "darwin") {
        app.quit()
    }
}

function onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
}

function createMainWindow() {
    let mainWindow = new BrowserWindow({
        width: 450,
        height: 175,
        frame: false,
        center:true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
  
    mainWindow.loadFile(`${__dirname}/views/index.html`)

    // Activate devTools
    //mainWindow.webContents.openDevTools()

    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
    })
}

function createConfigWindow() {
    let configWindow = new BrowserWindow({
        width: 595,
        height: 726,
        frame: false,
        center:true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    configWindow.loadFile(`${__dirname}/views/config.html`)

    // Activate devTools
    //configWindow.webContents.openDevTools()

    configWindow.once("ready-to-show", () => {
        configWindow.show()
    })
}

function execute(event, action) {
    event.reply("fade-to-white")

    setTimeout(() => {
        action()
        app.exit()
    }, 1000)
}

/* ////////////////////////////////////////////////////////////////////////////////// CODE ////////////////////////////////////////////////////////////////////////////////// */
app.on("ready", createMainWindow)

// ---------------------------------------------- MacOS specific things ---------------------------------------------- //

// On macOS applications stay active until the user quits explicitly with Cmd + Q
app.on("window-all-closed", onAllWindowsClosed)

// On macOS it"s common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
app.on("activate", onActivate)

/* //////////////////////////////////////////////////////////////////// IPCMAIN A-SYNCHRONOUS RESPONSES //////////////////////////////////////////////////////////////////// */
ipcMain.on("join-meeting", (event, subject, data) => {
    let classroomLink = data.Salones[subject.Salon]
    let url = "https://zoom.us/j/" + classroomLink

    execute(event,() =>{
        shell.openExternal(url)
    })
    
})

ipcMain.on("copy-link", (event, subject, data) => {
    let classroomLink = data.Salones[subject.Salon]
    let url = "https://zoom.us/j/" + classroomLink

    execute(event,() => {
        clipboard.writeText(url)
    })
})

ipcMain.on("on-reload-click", (event) => {
    let openedWindows = BrowserWindow.getAllWindows()

    for (let i = 0; i < openedWindows.length; i++) {
        openedWindows[i].reload() 
    }
})

ipcMain.on("show-details", (event, link) => {
    shell.openExternal(link)
})

ipcMain.on("on-close-button-click", function(event) {
    app.quit()
})

ipcMain.on("on-config-button-click", function(event) {
    createConfigWindow()
})

ipcMain.on("close-config", (event) => {
    configWindow.close()
})

ipcMain.on("get-selection", (event) => {
    let response = checkConfig()
    event.reply("selected", response)
})

ipcMain.on("save-file", (event, file) => {
    createConfigFile(file)
})

ipcMain.on("is-online", (event, argument) => {
    checkSchedule(event, argument)
})

ipcMain.on("exit", (event) => {
    app.exit()
})