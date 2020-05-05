import datetime
import requests
from sys import exit
from os import chdir, getcwd
from webbrowser import open as openWebLink
from pyperclip import copy as copyToClipboard
from tkinter import (Tk, messagebox, Toplevel, OptionMenu, Label, mainloop, StringVar, Button)

# ============================================================== MESSAGES ============================================================== #
RAW_SCHEDULE_LINK = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/schedule.json"
RAW_CLASSROOMS_LINK = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/classrooms.json"
ICON_PATH = r"link.ico"
WINDOW_GEOMETRY_FORMAT = "+{}+{}"
ZOOM_LINK_FORMAT = "https://zoom.us/j/{}"
CANCEL = "Cancelar"
MAIN_TITLE = "ZOOM LINKS"
MSGBOX_QUESTION = "¿Deseas entrar al aula de {}? \n(selecciona 'No' para copiar el link al portapapeles)"
MSGBOX_OPTIONS = "En este momento hay múltiples clases programadas para empezar, \npor favor selecciona la clase a la que vas a asistir: "
CONNECTION_ERROR_MSG = "No ha sido posible establecer conexion con la base de datos, Revisa tu conexion a internet e intentalo de nuevo."
NO_CLASSES_IN_SCHEDULE = "No hay ninguna clase programada a empezar en por lo menos una hora"

# ============================================================== FUNCTIONS ============================================================== #
def getCurrentTime():
    dt_now = datetime.datetime.now().time()
    time = (dt_now.hour * 100) + (dt_now.minute)
    return time

def createTkRoot():
    root = Tk()
    root.withdraw()
    root.iconbitmap(ICON_PATH)

def center(window):
    horizontal_coord = int((window.winfo_screenwidth() / 2) - (window.winfo_reqwidth()))
    vertical_coord = int((window.winfo_screenheight() / 2) - (window.winfo_reqheight() / 2))
    window.geometry(WINDOW_GEOMETRY_FORMAT.format(horizontal_coord, vertical_coord))

def requestJsonFile(file_link):
    try:
        request_data = requests.get(file_link).json()
    except(requests.exceptions.ConnectionError):
        messagebox.showerror(title = MAIN_TITLE, message = CONNECTION_ERROR_MSG)
        exit()

    return request_data

def evaluateQuestion(question, link):
    if question:
        openWebLink(ZOOM_LINK_FORMAT.format(link))
        exit()

    elif question is None:
        pass

    else:
        copyToClipboard(link)
        exit()

def questionMessageBox(subject):
    
    classroom = subject["Salon"]
    question_msgbox = messagebox.askyesnocancel(title = MAIN_TITLE, message = MSGBOX_QUESTION.format(subject["Nombre"]))
    
    evaluateQuestion(question_msgbox, classroom_links[classroom])

def getSubjectFromName(selected_name):
    for subject in range(len(schedule[week_day])):
        for item in schedule[week_day][subject].items():
            if (item[1] == selected_name): # the .items() methon returns a tuple = ('Key': <item>) thats why i'm asking for the second[1] item
                questionMessageBox(schedule[week_day][subject])

def createOptionsWindow(subjects_dictionary_list):
    list_of_options = []
    options_window = Toplevel()
    options_window.title(MAIN_TITLE)
    options_window.iconbitmap(ICON_PATH)
    center(options_window)

    selected_name = StringVar(options_window)
    selected_name.set("Seleccionar")
    
    for i in range(len(subjects_dictionary_list)):
        list_of_options.append(subjects_dictionary_list[i]["Nombre"])

    first_option = list_of_options[0]
    list_of_options.pop(0)

    options_message = Label(
        options_window,
        text = MSGBOX_OPTIONS
    )

    options_menu = OptionMenu(
        options_window,
        selected_name,
        first_option,
        *list_of_options,
        command = getSubjectFromName
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
subjects_in_schedule = []
schedule = requestJsonFile(RAW_SCHEDULE_LINK)
classroom_links = requestJsonFile(RAW_CLASSROOMS_LINK)

# ================================================================= CODE ================================================================= #
createTkRoot()

for subject in range(len(schedule[week_day])):
    if current_time in range(schedule[week_day][subject]["Inicio"], schedule[week_day][subject]["Final"]):
        subjects_in_schedule.append(schedule[week_day][subject])

if (len(subjects_in_schedule) == 0):
    messagebox.showerror(title = MAIN_TITLE, message = NO_CLASSES_IN_SCHEDULE,)

elif (len(subjects_in_schedule) == 1):
    questionMessageBox(subjects_in_schedule[0])

else:
    createOptionsWindow(subjects_in_schedule)
    
exit()