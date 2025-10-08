#!/bin/bash
# Este script le dice a la plataforma de hosting cómo iniciar nuestra aplicación.
# Inicia el servidor Gunicorn, que es más robusto para producción.
gunicorn bot:app