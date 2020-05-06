import {classesErrorMessage, copySuccessMessage, openSuccessMessage, oneClassMessage, multipleClassesMessage} from './SHAlerts.js'

function openLink(classroomsJson, subjectObject) {
    let subjectClassroom = subjectObject.Salon
    let classroomLink = classroomsJson[subjectClassroom]
    
    openSuccessMessage(function() {
        window.open("https://zoom.us/j/" + classroomLink,"_self")
    })
}

function copyToClipboard(classroomsJson, subjectObject) {
    let subjectClassroom = subjectObject.Salon
    let classroomLink = ("https://zoom.us/j/" + classroomsJson[subjectClassroom])

    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = classroomLink;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    copySuccessMessage.fire()
}

function verify(value) {
    
}

function check(dataJson) {
    let scheduleJson = dataJson.Horarios
    let classroomsJson = dataJson.Salones
    let today = new Date()
    let weekDay = (today.getDay() - 1)
    let time = (today.getHours() * 100) + today.getMinutes()
    let subjectsInSchedule = [];

    for (let subject = 0; subject < scheduleJson[weekDay].length; subject++) {
        if (scheduleJson[weekDay][subject].Inicio < time && scheduleJson[weekDay][subject].Final > time) {
            subjectsInSchedule.push(scheduleJson[weekDay][subject])
        }
    }
    
    if (subjectsInSchedule.length == 0) {
        classesErrorMessage.fire().then((result) => {
            if (result.dismiss === Swal.DismissReason.backdrop) {
                location.reload()
            }
        })

    } else if (subjectsInSchedule.length == 1) {
        oneClassMessage(subjectsInSchedule[0])
        .then((result) => {
            if (result.dismiss === Swal.DismissReason.backdrop) {
                location.reload()
            } else if (result.value) {
                openLink(classroomsJson, subjectsInSchedule[0])      
            } else {
                copyToClipboard(classroomsJson, subjectsInSchedule[0])
            }
        })

    } else {
        multipleClassesMessage(subjectsInSchedule, function (selectedName) {   
            for (let subject = 0; subject < subjectsInSchedule.length; subject++) {
                if (subjectsInSchedule[subject].Nombre == selectedName) {           
                    oneClassMessage(subjectsInSchedule[subject]).then((result) => {
                        if (result.dismiss === Swal.DismissReason.backdrop) {
                            location.reload()
                        } else if (result.value) {
                            openLink(classroomsJson, subjectsInSchedule[subject])      
                        } else {
                            copyToClipboard(classroomsJson, subjectsInSchedule[subject])
                        }
                    })
                }
            }
        })
    }
}

export default check