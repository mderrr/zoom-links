import json
import datetime
import requests
from sys import exit
from webbrowser import open as openWebLink
from pyperclip import copy as copyToClipboard
from tkinter import (Tk, messagebox, Toplevel, OptionMenu, Label, mainloop, StringVar, Button)

# ============================================================== MENSAJES ============================================================== #
RAW_SCHEDULE_LINK = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/schedule.json"
RAW_CLASSROOMS_LINK = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/classrooms.json"
ICON_PATH = r"link.ico"
FORM_GEOMETRY_WINDOW = "+{}+{}"
ZOOM_LINK_FORM = "https://zoom.us/j/{}"
CANCEL = "Cancelar"
TITULO_VENT_OPC = "Clases Programadas"
MSJBOX_PGA_TITLE = "Link Aula Zoom"
MSJBOX_PGA_DIALOG = "¿Deseas entrar al aula de {}? \n(selecciona 'No' para copiar el link al portapapeles)"
DIALOG_VENT_OPC = "En este momento hay múltiples clases programadas para empezar, \npor favor selecciona la clase a la que vas a asistir: "
DIALOG_ERR_MATERIAS = "No hay ninguna clase programada a empezar en por lo menos una hora"

# ============================================================== FUNCIONES ============================================================== #
def getCurrentTime():
    dt_now = datetime.datetime.now().time()
    tiempo = (dt_now.hour * 100) + (dt_now.minute)
    return tiempo

def createTkRoot():
    root = Tk()
    root.withdraw()
    root.iconbitmap(ICON_PATH)

def center(window):
    horizontal_coord = int((window.winfo_screenwidth() / 2) - (window.winfo_reqwidth()))
    vertical_coord = int((window.winfo_screenheight() / 2) - (window.winfo_reqheight() / 2))
    window.geometry(FORM_GEOMETRY_WINDOW.format(horizontal_coord, vertical_coord))

def evaluateQuestion(question, link):
    if question:
        openWebLink(link)
        exit()

    elif question is None:
        pass

    else:
        copyToClipboard(link)
        exit()

def questionMessageBox(subject):
    salones_request = requests.get(RAW_CLASSROOMS_LINK)
    classroom_links = salones_request.json()

    subject_link = ZOOM_LINK_FORM.format(classroom_links[subject["Salon"]])
    link_question = messagebox.askyesnocancel(title = MSJBOX_PGA_TITLE, message = MSJBOX_PGA_DIALOG.format(subject["Nombre"]))
    
    evaluateQuestion(link_question, subject_link)

def getSelectedSubject(value):
    for subject in range(len(data[week_day])):
        for name in data[week_day][subject].items():
            if (name[1] == value):
                questionMessageBox(data[week_day][subject])

def createOptionsWindow(lista_de_materias_seleccionadas):
    options_window = Toplevel()
    options_window.title(TITULO_VENT_OPC)
    center(options_window)

    selected_name = StringVar(options_window)
    selected_name.set("Seleccionar")
    
    list_of_options = []
    for i in range(len(lista_de_materias_seleccionadas)):
        list_of_options.append(lista_de_materias_seleccionadas[i]["Nombre"])

    options_message = Label(
        options_window,
        text = DIALOG_VENT_OPC
    )

    options_menu = OptionMenu(
        options_window,
        selected_name,
        "Seleccionar",
        *list_of_options,
        command=getSelectedSubject
    )

    cancel_button = Button(
        options_window, 
        text =  CANCEL, 
        width = 11, 
        command = lambda: exit()
    )

    options_message.pack(anchor = "nw", padx = 10, pady = 10)
    options_menu.pack()
    cancel_button.pack(padx = 24, pady = 12)
    mainloop()

# ============================================================== VARIABLES ============================================================== #
current_time = getCurrentTime()
week_day = datetime.datetime.now().date().weekday()
lista_de_materias_en_rango = []

# ============================================================== CODIGO ============================================================== #
createTkRoot()

horarios_request = requests.get(RAW_SCHEDULE_LINK)
data = horarios_request.json()

for materia in range(len(data[week_day])):
    if current_time in range(data[week_day][materia]["Inicio"], data[week_day][materia]["Final"]):
        lista_de_materias_en_rango.append(data[week_day][materia])

if (len(lista_de_materias_en_rango) == 0):
    messagebox.showerror(title = MSJBOX_PGA_TITLE, message = DIALOG_ERR_MATERIAS)

elif (len(lista_de_materias_en_rango) == 1):
    questionMessageBox(lista_de_materias_en_rango[0])

else:
    createOptionsWindow(lista_de_materias_en_rango)
    
exit()