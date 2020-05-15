

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

function checkSchedule(dataJson) {
    let scheduleJson = dataJson.Horarios
    let today = new Date()
    let weekDay = (today.getDay() - 1)
    let time = (today.getHours() * 100) + today.getMinutes()
    let subjectsInSchedule = [];

    for (let subject = 0; subject < scheduleJson[weekDay].length; subject++) {
        if (scheduleJson[weekDay][subject].Inicio < time && scheduleJson[weekDay][subject].Final > time) {
            subjectsInSchedule.push(scheduleJson[weekDay][subject])
        }
    }
    
    return subjectsInSchedule
}

function getJsonData(link) {
    fetch(link).then(response => response.json()).then(data => {
        return checkSchedule(data)
    })
}

export default getJsonData