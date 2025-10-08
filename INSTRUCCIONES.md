# Guía de Despliegue: Cómo Poner tu Chatbot en Internet

¡Felicidades! Hemos llegado al último paso. Todo el código de tu chatbot está preparado y listo para ser "desplegado", es decir, puesto en línea para que WhatsApp pueda comunicarse con él.

Usaremos un servicio gratuito llamado **Render**. Sigue estos pasos cuidadosamente.

---

### Video de Apoyo

Si prefieres una guía visual, este video (en inglés) muestra un proceso muy similar. Puedes usarlo como referencia junto con mis instrucciones escritas.

**Ver Video:** [Cómo Desplegar una App de Flask en Render (2025)](https://www.youtube.com/watch?v=vwoUriuqcio)

---

### Paso 1: Crea tu Cuenta en Render

1.  Ve a la página de Render: [https://render.com/](https://render.com/)
2.  Haz clic en **"Get Started"** o **"Sign Up"**.
3.  **La forma más fácil es registrarte usando tu cuenta de GitHub.** Esto conectará automáticamente tus proyectos.

### Paso 2: Crea un Nuevo "Web Service"

1.  Una vez dentro de tu panel de control de Render, busca y haz clic en el botón **"New +"**.
2.  En el menú que aparece, selecciona la opción **"Web Service"**.

### Paso 3: Conecta tu Repositorio de GitHub

1.  Render te mostrará una lista de tus repositorios de GitHub.
2.  Busca el repositorio de nuestro proyecto de chatbot en la lista y haz clic en **"Connect"** al lado de su nombre.

### Paso 4: Configura tu Servicio

Esta es la parte más importante. Render leerá nuestro código y rellenará algunos campos automáticamente. Asegúrate de que la configuración sea exactamente la siguiente:

*   **Name:** Elige un nombre único para tu bot (por ejemplo, `nova-cloud-bot`). Este nombre formará parte de tu URL.
*   **Region:** Puedes dejar la que viene por defecto.
*   **Branch:** Asegúrate de que esté seleccionada la rama `main` o `master`.
*   **Runtime:** Render debería detectar `Python 3` automáticamente. Si no, selecciónalo.
*   **Build Command:** `pip install -r requirements.txt` (Este comando instala todas las librerías que necesita nuestro bot).
*   **Start Command:** `sh start.sh` (Este comando ejecuta el script que creamos para iniciar el servidor de producción).

### Paso 5: Elige el Plan Gratuito y Lanza el Servicio

1.  Asegúrate de que está seleccionado el plan **"Free"**.
2.  Desplázate hasta el final de la página y haz clic en el botón **"Create Web Service"**.

### Paso 6: ¡Espera la Magia!

Render empezará a construir y desplegar tu bot. Este proceso puede tardar unos minutos. Verás un registro (log) en la pantalla que muestra el progreso.

Sabrás que ha terminado cuando veas un mensaje que dice **"Your service is live"**.

---

### Paso 7: Obtén tu URL y Conéctala a WhatsApp

Una vez que el despliegue haya terminado, Render te dará una URL pública en la parte superior de la página. Se verá algo así:

`https://nova-cloud-bot.onrender.com`

**¡Esta URL es la pieza final del rompecabezas!**

1.  **Copia esta URL.**
2.  Ve a tu **panel de desarrollador de Meta (Facebook for Developers)** donde configuraste tu número de WhatsApp.
3.  Busca la sección de **"Webhook"**.
4.  Pega tu URL de Render en el campo **"Callback URL"**.
5.  En el campo **"Verify Token"**, escribe exactamente el token que pusimos en nuestro código: `NOVA_CLOUD_TOKEN`.
6.  Guarda los cambios.

¡Y listo! A partir de ese momento, cada vez que alguien envíe un mensaje a tu número de WhatsApp, Meta lo enviará a tu servidor en Render, nuestro bot procesará el mensaje y (en la siguiente fase) le enviaremos la respuesta.

Has completado con éxito el despliegue del backend de tu chatbot. ¡Felicidades!