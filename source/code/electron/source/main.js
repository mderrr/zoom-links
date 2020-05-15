const {app, BrowserWindow, ipcMain, shell, clipboard} = require("electron")

/* ////////////////////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////////////// */
function getDate() {
    let date = new Date()

    return {
        today: (date.getDay() - 1),
        time: (date.getHours() * 100) + (date.getMinutes())
    }
}

function checkSchedule(event, data) {
    let response
    let date = getDate()
    let subjectsInSchedule = []
    let schedule = data.Horarios

    // Check for subjects in range 
    for (let i = 0; i < schedule[date.today].length; i++) {
        if (schedule[date.today][i].Inicio < date.time && schedule[date.today][i].Final > date.time) {

            // And if there are any add them to the list
            subjectsInSchedule.push(schedule[date.today][i])
        }
    }
    
    // check how many subjects there are
    if (subjectsInSchedule.length == 0) {
        response = "zero-subjects"

    } else if (subjectsInSchedule.length == 1) {
        response = "one-subject"

    } else {
        response = "multiple-subjects"
    }   

    // Tell the renderer script how many subjects there are
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

function createMainWindow () {

    // Create window
    let mainWindow = new BrowserWindow({
        width: 450,
        height: 175,
        frame: false,
        center:true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
  
    // load the index.html of the app.
    mainWindow.loadFile(`${__dirname}/views/index.html`)

    // Activate devTools
    //mainWindow.webContents.openDevTools()

    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
    })
}

function execute(event, action) {

    // Fade out
    event.reply("fade-to-white")

    // then execute the action and exit
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

    // execute the required action
    execute(event,() =>{
        shell.openExternal(url)
    })
    
})

ipcMain.on("copy-link", (event, subject, data) => {
    let classroomLink = data.Salones[subject.Salon]
    let url = "https://zoom.us/j/" + classroomLink

    // execute the required action
    execute(event,() => {
        clipboard.writeText(url)
    })
})

ipcMain.on("on-reload-click", () => {
    let openedWindows = BrowserWindow.getAllWindows()
    openedWindows[0].reload()
})

ipcMain.on("show-details", (event, link) => {
    shell.openExternal(link)
})

ipcMain.on("on-close-button-click", function(event) {
    app.quit()
})

ipcMain.on("is-online", (event, argument) => {
    checkSchedule(event, argument)
})

ipcMain.on("exit", (event) => {
    app.exit()
})