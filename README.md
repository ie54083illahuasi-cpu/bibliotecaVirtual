# 📚 BiblioTech - Manual de Instalación Local

¡Felicidades por completar el desarrollo del Sistema de Biblioteca Híbrido! 

Este sistema está diseñado con tecnología **React + IndexedDB**, lo que significa que **toda la base de datos vive dentro del propio navegador de la computadora**. No necesitas instalar complejos servidores de bases de datos como MySQL o SQL Server. 

Sigue estos simples pasos para instalar y hacer funcionar el sistema permanentemente en cualquier computadora de tu colegio o biblioteca.

---

## 🚀 Método Recomendado: Servidor de Producción (Rápido y Estable)

Este método preparará el sistema en su versión final (optimizada para que sea súper rápida) y la ejecutará localmente.

### Paso 1: Instalar los Requisitos Previos
1. Descarga e instala **Node.js** desde su página oficial: [https://nodejs.org/](https://nodejs.org/) (Descarga la versión "LTS").
2. Durante la instalación, simplemente dale a "Siguiente" a todo.

### Paso 2: Preparar la Carpeta del Sistema
1. Copia toda esta carpeta (`SISTEMA BIBLIOTECA`) y pégala en un lugar seguro de la nueva computadora (por ejemplo, en `C:\Sistemas\SISTEMA BIBLIOTECA`).
2. Abre la consola de comandos (`CMD` o `PowerShell`) dentro de esa carpeta.

### Paso 3: Instalar el Sistema
Escribe y ejecuta este comando para descargar todas las piezas que el código necesita para funcionar (solo se hace la primera vez):
```bash
npm install
```

### Paso 4: Construir la Versión Final
Ahora, vamos a empaquetar tu código en una versión súper veloz. Ejecuta:
```bash
npm run build
```
Esto creará una carpeta llamada `dist/` en tu proyecto. Esa carpeta contiene el sistema puro en HTML y JavaScript.

### Paso 5: Encender el Servidor Permanentemente
Para mantener el sistema vivo, instalaremos un mini-servidor web:
1. Instala la herramienta globalmente ejecutando: `npm install -g serve`
2. Luego, arranca el sistema ejecutando: `serve -s dist`

**¡Listo!** En la consola te aparecerá una dirección (por ejemplo: `http://localhost:3000`). Solo debes escribir esa dirección en Google Chrome y podrás usar todo el sistema y guardar libros. Toda la información se guardará mágicamente en el disco duro de esa PC.

---

## 🌐 Compartir en toda la Red de la Escuela (Red Local - LAN)

Si instalaste el sistema en la Computadora A (La principal de la biblioteca) y quieres que los estudiantes puedan ver el catálogo (`/portal`) desde sus celulares o desde las Computadoras B y C conectadas al mismo Wi-Fi:

1. Cuando ejecutes el paso 5 (`serve -s dist`), el programa te mostrará algo como esto:
   - Local: `http://localhost:3000`
   - **Network: `http://192.168.1.45:3000`** *(Ejemplo)*
2. Cualquier estudiante que se conecte al Wi-Fi de la biblioteca y escriba `http://192.168.1.45:3000/portal` en su celular, ¡ingresará automáticamente a tu catálogo virtual en la computadora principal!

---

### ⚠️ Advertencia sobre la Base de Datos Local
Debido a que el sistema usa `IndexedDB` (la base de datos interna del navegador de Google Chrome/Edge):
1. **Nunca borres el historial ni las "cookies y datos de sitios"** del navegador en la computadora principal, ya que esto borraría también tus libros y préstamos registrados.
2. Si un estudiante entra desde otra computadora conectada en red, **él no verá los libros que tú registraste localmente**, a menos que configures un backend en la nube en el futuro (como Firebase). Si deseas que la base de datos sea centralizada para todos los equipos actuales en tiempo real de forma local, el IndexedDB es excelente para máquinas individuales o modo catálogo estático.
