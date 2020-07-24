/* /////////////////////////////////////////////////////////////////////////// CLASS DECLARATION /////////////////////////////////////////////////////////////////////////// */
class Panel {
    constructor(properties) {
        this.isAlert = properties.isAlert
        this.isConfig = properties.isConfig
        this.template = properties.template
        this.message = properties.message
        this.details = properties.details
        this.backgroundColor = properties.backgroundColor
        this.showSelect = properties.showSelect
        this.buttons = properties.buttons
    }
}

/* ////////////////////////////////////////////////////////////////////////// CONSTANT DECLARATION ////////////////////////////////////////////////////////////////////////// */
const dataLink = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/data.json"
const errors = {
    "certificateNotYetValid": "FetchError: request to https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/data.json failed, reason: certificate is not yet valid",
    "error503": "GET https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/data.json 503 (Backend is unhealthy)"
}

const colors = {
    "white": "#ffffff",
    "errorRed": "#ef5350",
    "blue": "#2196f3",
    "successGreen": "#66bb6a"
}

/* ///////////////////////////////////////////////////////////////////////////// PANEL CREATION ///////////////////////////////////////////////////////////////////////////// */
const oneSubjectPanel = new Panel({
    "template": "success",
    "message": "todo listo para ingresar al aula de ",
    "backgroundColor": colors.successGreen,
    "buttons": [
        undefined,
        "copiar link",
        "entrar"
    ]
})

const multipleSubjectsPanel = new Panel({
    "template": "success",
    "message": "selecciona la clase a la que asistirás",
    "backgroundColor": colors.successGreen,
    "showSelect": true,
    "buttons": [
        undefined,
        "copiar link",
        "entrar"
    ]
})

const fadeToWhitePanel = new Panel({
    "isAlert": true,
    "template": "success",
    "backgroundColor": colors.white,
    "buttons": []
})

const noInternetPanel = new Panel({
    "isAlert": true,
    "template": "error",
    "message": "Comprueba el estado de tu internet e inténtalo de nuevo.",
    "details": "https://github.com/shernandezz/zoom-links/blob/master/HELP.md#no-se-pudo-establecer-conexi%C3%B3n",
    "backgroundColor": colors.errorRed,
    "buttons": [
        "ayuda",
        undefined,
        "reintentar"
    ]
})

const certificateNotYetValidPanel = new Panel({
    "isAlert": true,
    "template": "error",
    "message": "parece que tu certificado aún no es válido",
    "details": "https://github.com/shernandezz/zoom-links/blob/master/HELP.md#certificado-a%C3%BAn-no-es-v%C3%A1lido---no-funcion%C3%B3",
    "backgroundColor": colors.errorRed,
    "buttons": [
        "ayuda",
        undefined,
        "reintentar"
    ]
})

const noSubjectsInSchedule = new Panel({
    "isAlert": true,
    "template": "error",
    "message": "en este momento no hay clases programadas",
    "details": "https://github.com/shernandezz/zoom-links/blob/master/HELP.md#no-hay-clases-programadas",
    "backgroundColor": colors.errorRed,
    "buttons": [
        "ayuda",
        undefined,
        "reintentar"
    ]
})

const configPanel = new Panel({
    "isConfig": true,
    "template": "success",
    "backgroundColor": colors.blue,
    "buttons": [
        undefined,
        undefined,
        undefined,
        "Guardar"
    ]
})

/* /////////////////////////////////////////////////////////////////////////// ELEMENT GATHERING /////////////////////////////////////////////////////////////////////////// */
let interactionButton = document.getElementsByClassName("interactionButton")
let confirmButton = document.getElementById("confirmButton")
let saveButton = document.getElementById("saveButton")
let copyButton = document.getElementById("copyButton")
let cancelButton = document.getElementById("cancelButton")
let configButton = document.getElementById("configButton")
let fields = document.getElementsByClassName("field")
let checkButtons = document.getElementsByClassName("checkbox")
let subCheckbuttons = document.getElementsByClassName("sub")
let messageBox = document.getElementById("messageBox")
let configMessageBox = document.getElementById("configMessageBox")
let selectionBox = document.getElementById("selectionBox")
let mainArea = document.getElementById("mainArea")
let animationArea = document.getElementById("animationArea")

/* /////////////////////////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////////////////////// */
function createOptions(optionsArray, container) {
    for (let i = 0; i < optionsArray.length; i++) {
        let option = document.createElement("option");
        option.value = optionsArray[i].Nombre
        option.innerHTML = optionsArray[i].Nombre
        container.add(option) 
    }
}

function hideButtons(notHideSelect) {
    for (let i = 0; i < 3; i++) {
        interactionButton.item(i).style.visibility = "hidden"
        interactionButton.item(i).style.opacity = 0
    }

    if (notHideSelect !== true) {
        selectionBox.style.opacity = 0
        selectionBox.style.visibility = "hidden"
    }
}

function applyClasses(panel) {
    for (let i = 0; i < interactionButton.length; i++) {
        interactionButton.item(i).classList.add(
            interactionButton.item(i).id + "-" + panel.template,
            interactionButton.item(i).id + "-" + panel.template + "-" + "hover"
        )
    }

    configButton.classList.add(
        "configButton-set-left",
        "configButton-hover"
    )

    getSelections()
}

function displayButttons(panel) {
    hideButtons()
    
    for (let i = 0; i < interactionButton.length; i++) {
        if (panel.buttons[i] !== undefined) {
            interactionButton.item(i).style.opacity = 1
            interactionButton.item(i).style.visibility = "visible"
            interactionButton.item(i).textContent = panel.buttons[i]
        }
    }

    if (panel.showSelect) {
        selectionBox.style.opacity = 1
        selectionBox.style.visibility = "visible"

        if (selectionBox.value == "") {
            hideButtons(true)
        }
    }

    applyClasses(panel)
}

function getSubjectByName(subjectName, subjectsList) {
    for (let i = 0; i < subjectsList.length; i++) {
        if (subjectsList[i].Nombre == subjectName) {
            return subjectsList[i]
        }    
    }
}

function execute(action) {
    presentPanel(fadeToWhitePanel)

    setTimeout(() => {
        action()
    }, 1000)
}

function action(type, subject, data, details) {

    if (type == "details") {
        window.open(details, "_self")

    } else if (type == "config") {
        presentPanel(configPanel)

    } else if (type == "save") {
        saveConfig()
        execute(() => {
            window.location.reload()
        })

    } else {
        let classroomLink = data.Salones[subject.Salon]
        let url = "https://zoom.us/j/" + classroomLink

        if (type == "join") {
            execute(() => {
                window.open(url, "_self")
            })
        } else if (type == "copy") {
            execute(() => {
                var dummy = document.createElement("textarea");
                document.body.appendChild(dummy);
                dummy.value = url;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);

                window.location.reload()
            })
        }
    }
}

function presentPanel(panel, subjects, data) {
    let message = panel.message
    let subjectObject

    // Define the default starting functions for a click event
    function confirmClickAction() {action("join", subjectObject, data)}
    function saveClickAction() {action("save", undefined, undefined)}   
    function copyClickAction() {action("copy", subjectObject, data)}
    function cancelClickAction() {action("details", undefined, undefined, panel.details)}
    function configButtonAction() {action("config", undefined, undefined, undefined)}
    
    if (panel.isAlert) {
        confirmClickAction = () => {
            mainArea.style.backgroundColor = colors.white

            setTimeout(() => {
                location.reload()
            }, 1000)
        }

    } else if (panel.isConfig) {

        configMessageBox.textContent = "Seleccion de Materias"
        configMessageBox.style.opacity = 1
        message = ""
        
        configButton.style.visibility = "hidden"
        configButton.style.opacity = 0

        for (let i = 0; i < checkButtons.length; i++) {
            checkButtons.item(i).style.visibility = "visible"
            checkButtons.item(i).style.opacity = 1     
        }

        for (let i = 0; i < fields.length; i++) {
            fields.item(i).style.visibility = "visible"
            fields.item(i).style.opacity = 1     
        }

    } else if (panel.showSelect) {
        createOptions(subjects, selectionBox)

        selectionBox.addEventListener("change", () => {
            subjectObject = getSubjectByName(selectionBox.value, subjects)
            displayButttons(panel)
        })     
        
    } else {
        message = panel.message  + subjects[0].Nombre
        subjectObject = subjects[0]
    }

    displayButttons(panel)

    messageBox.style.opacity = 1
    messageBox.textContent = message
    mainArea.style.backgroundColor = panel.backgroundColor

    confirmButton.addEventListener("click", confirmClickAction)
    saveButton.addEventListener("click", saveClickAction)
    copyButton.addEventListener("click", copyClickAction) 
    cancelButton.addEventListener("click", cancelClickAction)
    configButton.addEventListener("click", configButtonAction)
}

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
    let counter = 0

    if (checkbox.checked) {
        for (let i = 0; i < childCheckButtons.length; i++) {
            if (childCheckButtons.item(i).checked) {
                counter += 1
            } else {
                counter += 0
            }
        }

        if (counter == childCheckButtons.length) {
            mainCheckButton.indeterminate = false
            mainCheckButton.checked = true
        } else {
            mainCheckButton.indeterminate = true
        }

    } else {
        for (let i = 0; i < childCheckButtons.length; i++) {
            if (childCheckButtons.item(i).checked) {
                counter += 1
            } else {
                counter += 0
            }
        }

        if (counter == 0) {
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
            for (let e = 0; e < childCheckButtons.length; e++) {
                childCheckButtons.item(e).classList.add("subCheckbox")
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

function createConfigFile(content) {
    console.log(content)

    localStorage.setItem("zoomLinksConfig", "")
    localStorage.setItem("zoomLinksConfig", content)
}

function checkConfig() {
    let content = ""
    let contentArray = []

    try {
        content = localStorage.getItem("zoomLinksConfig")
        contentArray = content.split(",")
    } catch (e) {
        if (e instanceof Object) {
            createConfigFile("")
        } else {
            console.error(typeof e)
        }
    }
    
    return contentArray
}

function getSelections() {
    let response = checkConfig()
    updateSelections(response)
}

function saveConfig() {
    let configFile = []

    for (let i = 0; i < subCheckbuttons.length; i++) {
        if (subCheckbuttons.item(i).checked) {
            console.log("one is check")
            configFile.push(subCheckbuttons.item(i).value)
        }   
    }

    createConfigFile(configFile.toString())
}

function getDate() {
    let date = new Date()

    return {
        today: (date.getDay() - 1),
        time: (date.getHours() * 100) + (date.getMinutes())
    }
}

function checkSchedule(data) {
    let date = getDate()
    let content = checkConfig()
    let subjectsInSchedule = []
    let schedule = data.Horarios

    // Check for subjects in range 
    for (let i = 0; i < schedule[date.today].length; i++) {
        if (schedule[date.today][i].Inicio < date.time && schedule[date.today][i].Final > date.time) {
            if (content.includes(schedule[date.today][i].Codigo)) {
                subjectsInSchedule.push(schedule[date.today][i])
            }
        }
    }
    
    // check how many subjects there are
    if (subjectsInSchedule.length == 0) {
        if (content == "") {
            action("config", undefined, undefined, undefined)
        } else {
            presentPanel(noSubjectsInSchedule)
        }   

    } else if (subjectsInSchedule.length == 1) {
        presentPanel(oneSubjectPanel, subjectsInSchedule, data)

    } else {
        presentPanel(multipleSubjectsPanel, subjectsInSchedule, data)
    }   
}


function checkConnection() {
      
    fetch(dataLink).then(response => response.json()).then(data => {
        checkSchedule(data)

    }).catch((reason) => {
        if (reason == "TypeError: Failed to fetch") {
            presentPanel(noInternetPanel)
        } else {
            presentPanel(certificateNotYetValidPanel)
        }
    })
        
    // Then hide the title screen
    animationArea.style.opacity = 0
    animationArea.style.visibility = "hidden"
}

function displayTitleScreen() {

    // set transitions
    mainArea.classList.add("trans")
    animationArea.classList.add("trans")
    messageBox.classList.add("trans")
    selectionBox.classList.add("trans")
    
    // Show the title screen
    animationArea.style.opacity = 1
    animationArea.style.visibility = "visible"

    // then Check the internet connection
    setTimeout(checkConnection, 1500)
}

/* ////////////////////////////////////////////////////////////////////////////////// CODE ////////////////////////////////////////////////////////////////////////////////// */
setTimeout(displayTitleScreen, 1000)
