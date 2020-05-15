const {ipcRenderer} = require("electron")

/* /////////////////////////////////////////////////////////////////////////// CLASS DECLARATION /////////////////////////////////////////////////////////////////////////// */
class Panel {
    constructor(properties) {
        this.isAlert = properties.isAlert
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
    "certificateNotYetValid": "FetchError: request to https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/data.json failed, reason: certificate is not yet valid"
}

// ---------------------- Color palette ---------------------- //
const colors = {
    "white": "#ffffff",
    "errorRed": "#ef5350",
    "successGreen": "#66bb6a"
}

// --------------------- Panel creation --------------------- //
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

/* /////////////////////////////////////////////////////////////////////////// ELEMENT GATHERING /////////////////////////////////////////////////////////////////////////// */

// Get the button classes
let interactionButton = document.getElementsByClassName("interactionButton")

// Get the individual buttons
let confirmButton = document.getElementById("confirmButton")
let copyButton = document.getElementById("copyButton")
let cancelButton = document.getElementById("cancelButton")
let closeButton = document.getElementById("closeButton")

// Get the messageBox 
let messageBox = document.getElementById("messageBox")

// Get the selection box
let selectionBox = document.getElementById("selectionBox")

// Get the Areas
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

    // Hide interaction buttons
    for (let i = 0; i < 3; i++) {
        interactionButton.item(i).style.visibility = "hidden"
        interactionButton.item(i).style.opacity = 0
    }

    // Also the hide select box unless especified otherwise
    if (notHideSelect !== true) {
        selectionBox.style.opacity = 0
        selectionBox.style.visibility = "hidden"
    }
}

function applyClasses(panel) {

    // apply effects to each interaction button
    for (let i = 0; i < interactionButton.length; i++) {
        interactionButton.item(i).classList.add(
            interactionButton.item(i).id + "-" + panel.template,
            interactionButton.item(i).id + "-" + panel.template + "-" + "hover"
        )
    }

    //  Also apply to the close button
    closeButton.classList.add(`closeButton-${panel.template}-hover`)
}

function displayButttons(panel) {

    // Make sure all buttons are hidden already
    hideButtons()
    
    // Check which interaction buttons to make visible
    for (let i = 0; i < interactionButton.length; i++) {
        if (panel.buttons[i] !== undefined) {
            interactionButton.item(i).style.opacity = 1
            interactionButton.item(i).style.visibility = "visible"
            interactionButton.item(i).textContent = panel.buttons[i]
        }
    }

    // Check weather to show the select box
    if (panel.showSelect) {
        selectionBox.style.opacity = 1
        selectionBox.style.visibility = "visible"

        // Check if the selection box has a selected value, if it doesn't then dont show the interaction buttons
        if (selectionBox.value == "") {
            hideButtons(true)
        }
    }

    // Then add the classes for effects
    applyClasses(panel)
}

function getSubjectByName(subjectName, subjectsList) {
    for (let i = 0; i < subjectsList.length; i++) {
        // Go through every name until a match is found
        if (subjectsList[i].Nombre == subjectName) {
            return subjectsList[i]
        }    
    }
}

function presentPanel(panel, subjects, data) {
    let message = panel.message
    let subjectObject

    // Define the default starting functions for a click event
    function confirmClickAction() {ipcRenderer.send("join-meeting", subjectObject, data)}
    function copyClickAction() {ipcRenderer.send("copy-link", subjectObject, data)}
    function cancelClickAction() {ipcRenderer.send("show-details", panel.details)}
    function closeClickAction() {ipcRenderer.send("on-close-button-click")}

    // Check what actions to assign to the buttons depending on the panel type(alert, selection or normal)
    if (panel.isAlert) {

        // Set the custom actions of the buttons
        confirmClickAction = () => {

            // Set the area color to white in order to get a fade out effect
            mainArea.style.backgroundColor = colors.white

            // Then send a reload request
            setTimeout(() => {
                ipcRenderer.send("on-reload-click", panel.details)
            }, 1000)
        }

    } else if (panel.showSelect) {

        // Append the options to the selection box
        createOptions(subjects, selectionBox)
        
        // Set the selected object every time the value changes
        selectionBox.addEventListener("change", () => {
            subjectObject = getSubjectByName(selectionBox.value, subjects)
            displayButttons(panel)
        })     
        
    } else {

        // Set the message to show
        message = panel.message  + subjects[0].Nombre

       // Set the object 
        subjectObject = subjects[0]
    }

    // Display the required buttons
    displayButttons(panel)

    // Make the message box visible and give it the message
    messageBox.style.opacity = 1
    messageBox.textContent = message
    
    // Change the color  
    mainArea.style.backgroundColor = panel.backgroundColor

    // Set the functions of the buttons
    confirmButton.addEventListener("click", confirmClickAction)
    copyButton.addEventListener("click", copyClickAction) 
    cancelButton.addEventListener("click", cancelClickAction)
    closeButton.addEventListener("click", closeClickAction)
}



function checkConnection() {

    // Check the connection
    if (navigator.onLine) {
        
        fetch(dataLink).then(response => response.json()).then(data => {
            ipcRenderer.send("is-online", data) 

        }).catch((reason) => {

            if (reason == errors.certificateNotYetValid) {
                presentPanel(certificateNotYetValidPanel)
            }
        })
        

    } else {
        presentPanel(noInternetPanel)
    }

    // Then hide the title screen
    animationArea.style.opacity = 0
    animationArea.style.visibility = "hidden"
}

function displayTitleScreen() {
    
    // Show the title screen
    animationArea.style.opacity = 1
    animationArea.style.visibility = "visible"

    // then Check the internet connection
    setTimeout(checkConnection, 1500)
}

/* ////////////////////////////////////////////////////////////////////////////////// CODE ////////////////////////////////////////////////////////////////////////////////// */
setTimeout(displayTitleScreen, 1000)

/* ////////////////////////////////////////////////////////////////// IPCRENDERER A-SYNCHRONOUS RESPONSES ////////////////////////////////////////////////////////////////// */

ipcRenderer.on("zero-subjects", (event) => {
    presentPanel(noSubjectsInSchedule)
})

ipcRenderer.on("one-subject", (event, subjects, data) => {
    presentPanel(oneSubjectPanel, subjects, data)
})

ipcRenderer.on("multiple-subjects", (event, subjects, data) => {
    presentPanel(multipleSubjectsPanel, subjects, data)
})

ipcRenderer.on("fade-to-white", (event) => {
    presentPanel(fadeToWhitePanel)
})