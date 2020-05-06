function mainMessage(func) {
    Swal.fire({
        title: "Zoom Links",
        text: "Cargando",
        timer: 1500,
        showClass: {popup: "animated fadeIn fast"},
        hideClass: {popup: "animated fadeOut fast"},
        onBeforeOpen: () => {Swal.showLoading()},
        onOpen: () => {
            Swal.stopTimer()
            func()
            Swal.resumeTimer()
        },
        onAfterClose: () => {location.reload()}
    })
}

function oneClassMessage(subjectObject) {
    return Swal.fire({
        title: "Zoom Links",
        text: "Deseas entrar al aula de " + subjectObject.Nombre,
        showCancelButton: true,
        cancelButtonText: "Copiar Link",
        confirmButtonText: "Aceptar",
        showClass: {popup: "animated fadeIn fast"},
        hideClass: {popup: "animated fadeOut fast"},
        onAfterClose: () => {location.reload()}
    })
}

function multipleClassesMessage(arrayOfSubjects, verifyFunction) {
    let options = {}

    for (let index = 0; index < arrayOfSubjects.length; index++) {
        let subjectName = arrayOfSubjects[index].Nombre
        options[subjectName] = subjectName
    }

    Swal.fire({
        title: "¿A que clase vas a asistir?",
        input: "select",
        inputOptions: options,
        inputPlaceholder: "Seleccionar",
        showCancelButton: true,
        showClass: {popup: "animated fadeIn fast"},
        hideClass: {popup: "animated fadeOut fast"},
        inputValidator: (value) => {
            if (value == "") {
                console.log("a")
                selectErrorMessage.fire()
                
            } else {
                verifyFunction(value)
            }
        },
        onAfterClose: () => {location.reload()}
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.backdrop) {
            location.reload()
        }
    })
}

function openSuccessMessage(func) {
    console.log("a")
    Swal.fire({
        text: "Redireccionando",
        timer: 1500,
        showClass: {popup: "animated fadeIn fast"},
        hideClass: {popup: null},
        onBeforeOpen: () => {Swal.showLoading()},
        onAfterClose: () => {func()}
    })
}

const selectErrorMessage = Swal.mixin({
    text: "Porfavor Selecciona una Clase",
    timer: 2250,
    showConfirmButton: false,
    showClass: {popup: "animated fadeIn fast"},
    onAfterClose: () => {location.reload()}
})

const classesErrorMessage = Swal.mixin({
    title: "Zoom Links",
    text: "No hay clases programadas",
    confirmButtonText: "Aceptar",
    showClass: {popup: "animated fadeIn fast"},
    hideClass: {popup: "animated fadeOut fast"},
    onAfterClose: () => {location.reload()}
})

const copySuccessMessage = Swal.mixin({
    text: "Link Copiado Al Portapapeles",
    icon: "success",
    showConfirmButton: false,
    timer: "7500",
    showClass: {popup: "animated fadeIn fast"},
    hideClass: {popup: "animated fadeOut fast"},
    onAfterClose: () => {location.reload()}
})

export {classesErrorMessage, copySuccessMessage, openSuccessMessage, mainMessage, oneClassMessage, multipleClassesMessage}