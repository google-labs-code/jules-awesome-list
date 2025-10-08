from flask import Flask, request
import logging

# --- Configuración del Logging ---
# Esto guardará los mensajes en un archivo llamado bot.log
logging.basicConfig(
    filename='bot.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
# ---------------------------------

# Creamos la aplicación Flask
app = Flask(__name__)

def get_bot_response(message: str) -> str:
    """
    Este es el cerebro del bot. Recibe un mensaje y devuelve una respuesta.
    """
    lower_message = message.lower()
    if 'hola' in lower_message:
        return "¡Hola! Gracias por contactar a Nova Cloud. ¿Cómo puedo ayudarte hoy?"
    elif 'precio' in lower_message or 'costo' in lower_message or 'cotización' in lower_message:
        return "¡Claro! Para darte una cotización precisa, ¿podrías contarme más sobre tu proyecto?"
    elif 'ayuda' in lower_message or 'soporte' in lower_message:
        return "Por supuesto. Nuestro equipo de soporte está listo para ayudarte. ¿Cuál es tu consulta?"
    elif 'gracias' in lower_message:
        return "¡De nada! Ha sido un placer ayudarte."
    else:
        return "No he entendido tu consulta. ¿Podrías reformularla?"

@app.route('/webhook', methods=['GET', 'POST'])
def webhook():
    """
    Este es el webhook que recibe los mensajes de WhatsApp.
    """
    if request.method == 'GET':
        if request.args.get("hub.verify_token") == "NOVA_CLOUD_TOKEN":
            logging.info("Webhook verificado correctamente.")
            return request.args.get("hub.challenge")
        else:
            logging.error("Error de autenticación en el webhook.")
            return "Error de autenticación.", 403

    if request.method == 'POST':
        try:
            body = request.json
            logging.info(f"Datos recibidos de WhatsApp: {body}")

            if body.get('entry') and body['entry'][0].get('changes') and \
               body['entry'][0]['changes'][0].get('value') and \
               body['entry'][0]['changes'][0]['value'].get('messages') and \
               body['entry'][0]['changes'][0]['value']['messages'][0].get('text'):

                user_message = body['entry'][0]['changes'][0]['value']['messages'][0]['text']['body']
                logging.info(f"Mensaje del usuario: '{user_message}'")

                bot_response = get_bot_response(user_message)
                logging.info(f"Respuesta del bot: '{bot_response}'")

        except Exception as e:
            logging.error(f"Error procesando el mensaje: {e}", exc_info=True)
            pass

        return "OK", 200

if __name__ == "__main__":
    # El servidor se ejecutará en el puerto que la plataforma de hosting asigne,
    # o en el 5000 si se ejecuta localmente.
    # Escuchar en 0.0.0.0 hace que sea accesible desde fuera del contenedor.
    app.run(host='0.0.0.0', port=5000)