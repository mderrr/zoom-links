const {ipcRenderer, BrowserWindow, remote} = require("electron")

/* ////////////////////////////////////////////////////////////////////////// CONSTANT DECLARATION ////////////////////////////////////////////////////////////////////////// */
const colors = {
    "white": "#ffffff",
    "blue": "#2196f3",
    "errorRed": "#ef5350",
    "successGreen": "#66bb6a"
}

/* /////////////////////////////////////////////////////////////////////////// ELEMENT GATHERING /////////////////////////////////////////////////////////////////////////// */
let checkButtons = document.getElementsByClassName("checkbox")
let subCheckbuttons = document.getElementsByClassName("sub")
let closeButton = document.getElementById("closeButton")
let messageBox = document.getElementById("configMessageBox")
let mainArea = document.getElementById("mainArea")

/* /////////////////////////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////////////////////// */
function checkAll(checkbox, childCheckButtons) {   
    if (checkbox.checked) {
        for (let i = 0; i < childCheckButtons.length; i++) {
            childCheckButtons.item(i).checked = true;
        }

    } else {
        for (let i = 0; i < childCheckButtons.length; i++) {
            childCheckButtons.item(i).checked = false;
        }
    }
}

function checkboxChange(checkbox, childCheckButtons) {
    let mainCheckButton = document.getElementsByClassName(`${checkbox.className.substr(0, 9)}Main`).item(0)
    let bool = 0

    if (checkbox.checked) {
        for (let i = 0; i < childCheckButtons.length; i++) {
            if (childCheckButtons.item(i).checked) {
                bool += 1
            } else {
                bool += 0
            }
        }

        if (bool == childCheckButtons.length) {
            mainCheckButton.indeterminate = false
            mainCheckButton.checked = true
        } else {
            mainCheckButton.indeterminate = true
        }

    } else {
        for (let i = 0; i < childCheckButtons.length; i++) {
            if (childCheckButtons.item(i).checked) {
                bool += 1
            } else {
                bool += 0
            }
        }

        if (bool == 0) {
            mainCheckButton.indeterminate = false    
            mainCheckButton.checked = false
        } else {
            mainCheckButton.indeterminate = true
        }
    }
}

function readyCheckboxes() {
    for (let i = 0; i < checkButtons.length; i++) {
        let checkbox = checkButtons.item(i)
        let childCheckButtons = document.getElementsByClassName(checkbox.className.substr(0, 9))
        
        if (checkbox.className.includes("Main")) {
            let counter = 0

            for (let e = 0; e < childCheckButtons.length; e++) {
                if (childCheckButtons.item(e).checked) {
                    counter += 1
                } else {
                    counter += 0
                }
            }

            if (counter == childCheckButtons.length) {
                checkButtons.item(i).indeterminate = false    
                checkButtons.item(i).checked = true
            } else if (counter == 0) {
                checkButtons.item(i).indeterminate = false    
                checkButtons.item(i).checked = false
            } else {
                checkButtons.item(i).indeterminate = true 
            }
            
            checkbox.addEventListener("change", () => {checkAll(checkbox, childCheckButtons)})
        } else {
            for (let i = 0; i < childCheckButtons.length; i++) {
                childCheckButtons.item(i).classList.add("subCheckbox")
            }

            checkbox.addEventListener("change", () => {checkboxChange(checkbox, childCheckButtons)})
        }
    }
}

function updateSelections(selection) {
    for (let i = 0; i < selection.length; i++) {
        for (let e = 0; e < subCheckbuttons.length; e++) {
            if (subCheckbuttons.item(e).value == selection[i]) {
                subCheckbuttons.item(e).checked = true
            }
        }  
    }

    readyCheckboxes()
}

function getSelections() {
    ipcRenderer.send("get-selection")

    ipcRenderer.on("selected", (event, selection) => {
        updateSelections(selection)
    })
}

function applyClasses() {
    messageBox.classList.add("configMessageBox")
    closeButton.classList.add("closeButton-success-hover")
    getSelections()
}

function saveConfig() {
    let configFile = []

    for (let i = 0; i < subCheckbuttons.length; i++) {
        if (subCheckbuttons.item(i).checked) {
            configFile.push(subCheckbuttons.item(i).value)
        }   
    }

    ipcRenderer.send("save-file", configFile.toString())
}

/* ////////////////////////////////////////////////////////////////////////////////// CODE ////////////////////////////////////////////////////////////////////////////////// */
applyClasses()

messageBox.style.opacity = 1
messageBox.textContent = "Selección de asignaturas"
mainArea.style.backgroundColor = colors.blue

closeButton.addEventListener("click", () => {
    saveConfig()
    ipcRenderer.send("on-reload-click")
    remote.getCurrentWindow().close()
})