# Ayuda

>Si estás teniendo problemas con la instalación de Zoom Links en tu dispositivo revisa el apartado de ayuda para tu respectiva versión, busca tu problema y sigue los pasos listados para darle solución:
+ [**ZoomLinks v2**](#zoomlinks-v2)
+ [**Android**](#ayuda-para-android)
+ [**MacOS**](#ayuda-para-macos)
+ [**Linux**](#ayuda-para-linux)
+ [**Código Fuente**](#código-fuente)
+ [Regresar](/README.md#descargas)

***

## _Ayuda para MacOS_
+ No se pudo abrir porque es de un desarrollador no identificado - [Ver](#no-se-pudo-abrir-porque-es-de-un-desarrollador-no-identificado---no-funcionó)
+ [¿No encuentras tu problema?](#mi-problema-no-está-listado)

### **No se pudo abrir porque es de un desarrollador no identificado** - [¿No Funcionó?](#mi-problema-no-fue-resuelto-por-la-ayuda)
 
> + Luego de haber ejecutado el programa.
> + Abre las `preferencias del sistema`.
> + Selecciona `Seguridad y Privacidad`.
> + En la parte inferior de la pestaña `general`.
> + En el apartado de `permitir apps descargadas desde`.
> + Busca el botón de `abrir de todos modos` y haz click en él.

[Regresar](#ayuda)

***

## _Ayuda para iOS_
> Lamentablemente el desarrollo de Zoom Links en las plataformas de Apple no ha sido el mas amigable, y en cuanto a iOS su desarrollo ha quedado pospuesto de manera indefinida, sin embago la aplicacíon ahora está disponible para navegador, si quires usar esta version recomiedo añadir la página a tus marcadores para tener mas fácil acceso a esta.
+ [**Zoom Links para Navegador**](/README.md/#decargas)

[Regresar](#ayuda)

***

## _Ayuda para Android_
+ Por tu seguridad tu teléfono no tiene permitido instalar apps desconocidas de esta fuente - [Ver](#por-tu-seguridad-tu-teléfono-no-tiene-permitido-instalar-apps-desconocidas-de-esta-fuente---no-funcionó)
+ [¿No encuentras tu problema?](#mi-problema-no-está-listado)

### **Por tu seguridad, tu teléfono no tiene permitido instalar apps desconocidas de esta fuente** - [¿No Funcionó?](#mi-problema-no-fue-resuelto-por-la-ayuda)
 
> + En el mensaje haz click en la opción `configuración`.
> + Activa la casilla de `permitir desde esta fuente`.
> + Regresa a la instalación.
> + Presiona `instalar` para completar el proceso.

[Regresar](#ayuda)

***

## _ZoomLinks v2_
+ No se pudo establecer conexión - [Ver](#no-se-pudo-establecer-conexión)
+ No hay clases programadas - [Ver](#no-hay-clases-programadas)
+ Certificado aún no es válido - [Ver](#certificado-aún-no-es-válido---no-funcionó)
+ [¿No encuentras tu problema?](#mi-problema-no-está-listado)

### **No se pudo establecer conexión**
 
> Si estas viendo esta página de ayuda entonces tu conexión ha internet esta funcionando. 
> Por favor notifícame de este incidente con los detalles pertinentes.

### **No hay clases programadas**
 
> Si estas recibiendo este error aún estando en el plazo de una hora, antes o despues del inicio de una clase: por favor notifícame de este incidente con los detalles pertinentes.

### **Certificado aún no es válido** - [¿No Funcionó?](#mi-problema-no-fue-resuelto-por-la-ayuda)
 
> Este error por lo general sucede cuando la fecha y hora de tu máquina no coincide con la de la página.

> + Si estas cambiando la fecha de tu maquina para probar ZoomLinks, entonces intenta que la fecha que definas no sea muy lejada a la real.
> + Si no estas modificando la fecha de tu maquina por favor notifícame de este incidente con los detalles pertinentes.

[Regresar](#ayuda)

***

## _Ayuda para Linux_
+ No hay aplicación instalada para archivos ejecutables - [Ver](#no-hay-aplicación-instalada-para-archivos-ejecutables---no-funcionó)
+ [¿No encuentras tu problema?](#mi-problema-no-está-listado)

### **No hay aplicación instalada para archivos ejecutables** - [¿No Funcionó?](#mi-problema-no-fue-resuelto-por-la-ayuda)

> + Haz `click derecho` en el archivo.
> + Selecciona la opción `propiedades`.
> + Selecciona la ventana de `permisos`.
> + Activa la casilla `permitir ejecutar archivo como programa`.

[Regresar](#ayuda)

***
## _Código Fuente_
+ Como acceder al código fuente en Windows, MacOS y Linux - [Ver](#acceder-en-windows-macos-y-linux)
+ Como acceder al código fuente en Android y IOS - [Ver](#acceder-en-android-y-ios)
+ [¿No encuentras tu problema?](#mi-problema-no-está-listado)

### **Acceder en Windows, MacOS y Linux:**
>Para manipular el código fuente de la nueva version 2.0.1 es necesario tener [**Node js**](https://nodejs.org/) instalado, luego navega a la carpeta del codigo y descárgala:
   + Navega a la carpeta de [`electron`](/source/code/electron)

>Una vez descargada utiliza los siguientes comandos dentro de la carpeta usando la terminal del sistema:
   + `npm i electron -D`
   + `npm i asar -D`
   + `npm i electron-builder -D`

> Luego de cumplir los requisitos puedes hacer cambios al código que se encuentra en la carpeta de `source/`. Si luego de editarla deseas convertirla en un ejecutable:
   + Busca en la carpeta descargada un archivo llamado `package-lock.json`, si existe elimínalo.
   + Usando la terminal dentro de la carpeta ejecuta: `npm run dist-"os"`, remplaza "os" con el sistema operativo de tu sistema (win, linux, mac).
   + Se creará la subcarpeta `dist` y dentro de esta se encuentra el archivo ejecutable del programa.
   + [Más información](https://www.electronjs.org/docs)

### **Acceder en Android y IOS:**
>Para manipular el código fuente de la nueva version 2.0.1 en Android es nesesario tener [**Node js**](https://nodejs.org/) instalado, además para android es nesesario tener [**Android Studio**](https://developer.android.com/studio/) y para ios [**Xcode**](https://developer.apple.com/xcode/). Luego navega a la carpeta del codigo y descárgala:
   + Navega a la carpeta [`capacitor`](/source/code/capacitor)

>Una vez descargada utiliza los siguientes comandos dentro de la carpeta usando la terminal del sistema:
   + `npm i --save @capacitor/core @capacitor/cli`
   + `npx cap init`

> Luego de cumplir los requisitos puedes hacer cambios al código que se encuentra en la carpeta de `www/`. Si luego de editarla deseas convertirla en un ejecutable:
   + Usando la terminal dentro de la carpeta ejecuta: `npx cap add android` o `npx cap add ios` dependiendo de la plataforma.
   + Luego ejecuta `npx open andriod` o `npx open ios` para abrir en el editor nativo de cada plataforma.
   + Desde ahi puedes ejecutar la aplicacion para probarla o empaquetarla.
   + [Más información](https://capacitor.ionicframework.com/docs/)

[Regresar](#ayuda)

***
## Otros

#### **Mi problema no fue resuelto por la ayuda**
>Si al seguir las instrucciones propuestas el problema persiste, por favor comunicate conmigo por cualquier medio y hazme saber en detalle las circunstancias que dan lugar a tu problema para poder asistirte.

#### **Mi problema no está listado**
>Si tu problema no aparece listado en el apartado de ayuda para tu versión de Zoom Links, por favor comunicate conmigo por cualquier medio y hazme saber tu situación para poder asistirte.

[Regresar](#ayuda)