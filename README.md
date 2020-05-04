# Descargas
+ [**Windows**](https://github.com/shernandezz/zoom-links/raw/master/Versions/Windows/ZL%20Windows%20Installer.exe)
+ [**Android**](https://github.com/shernandezz/zoom-links/raw/master/Versions/Android/ZL%20andriod.apk)
+ [**MacOS**](https://github.com/shernandezz/zoom-links/raw/master/Versions/MacOS/Zoom%20Links.app.zip)
+ [**Linux**](https://github.com/shernandezz/zoom-links/raw/master/Versions/Linux/Zoom%20Links)
+ **iOS** - _Desarrollo en proceso_

[**¿Necesitas Ayuda?**](#ayuda)

***

# Zoom Links
Este repositorio es el hogar del proyecto de generador de links para zoom y contiene todas sus versiones.

***

# Ayuda
#### [`Android`](#android) [`MacOS`](#macos) [`Linux`](#linux) [`Código Fuente`](#como-acceder-al-código-fuente)

**Tengo un problema**
>Si estás teniendo problemas con la instalación de Zoom Links en tu dispositivo revisa el apartado de ayuda para tu respectiva versión, busca tu problema y sigue los pasos listados para darle solución.

**Mi problema no fue resuelto por la ayuda**
>Si al seguir las instrucciones propuestas el problema persiste, por favor comunicate conmigo por cualquier medio y hazme saber en detalle las circunstancias que dan lugar a tu problema para poder asistirte.

**Mi problema no está listado**
>Si tu problema no aparece listado en el apartado de ayuda para tu versión de Zoom Links, por favor comunicate conmigo por cualquier medio y hazme saber tu situación para poder asistirte.


## _MacOS_
**Si al momento de abrir el archivo ejecutable se muestra un error diciendo:**
> "No se puede abrir porque es de un desarrollador no identificado".

+ Luego de haber ejecutado el programa.
+ Abre las `preferencias del sistema`.
+ Selecciona `Seguridad y Privacidad`.
+ En la parte inferior de la pestaña `general`.
+ En el apartado de `permitir apps descargadas desde`.
+ Busca el botón de `abrir de todos modos` y haz click en él.

## _Android_
**Si al momento de abrir el archivo ejecutable se muestra un mensaje diciendo:**
> "Por tu seguridad, tu teléfono no tiene permitido instalar apps desconocidas de esta fuente".

+ En el mensaje haz click en la opción `configuración`.
+ Activa la casilla de `permitir desde esta fuente`.
+ Regresa a la instalación.
+ Presiona `instalar` para completar el proceso.

## _Linux_
**Si al momento de abrir el archivo ejecutable se muestra un error diciendo:**
> "No hay aplicación instalada para archivos ejecutables".

+ Haz `click derecho` en el archivo.
+ Selecciona la opción `propiedades`.
+ Selecciona la ventana de `permisos`.
+ Activa la casilla `permitir ejecutar archivo como programa`.

## Como acceder al código fuente
### **Para Windows, MacOS y Linux:**
>Es necesario tener [**Python**](https://www.python.org/) instalado junto con los módulos `pyperclip`, `webbrowser`, `datetime`, `requests` y `tkinter`.                                          
Todos excepto por `pyperclip` estan instalados por defecto en Pyhthon 3.x, pero en caso de no estarlo pueden ser instalados usando pip.

#### Si no sabes usar `pip`: 
+ Sigue este [Tutorial](https://tecnonucleous.com/2018/01/28/>como-instalar-pip-para-python-en-windows-mac-y-linux/) por tecnonucleous.

#### Para encontrar el código fuente navega a:
+ [`Versiones`](/Versions)
+ Selecciona la carpeta de la versión correspondiente a tu máquina.
+ Selecciona la carpeta `Source Code`

### **Para Android:**
>Para manipular el código fuente de Android es nesesario tener [**Android Studio**](https://developer.android.com/studio/) instalado.

#### Para encontrar el código fuente de Android:
+ navega a la carpeta [**`Android Studio Project`**](/Versions/Android/Android%20Studio%20Project)