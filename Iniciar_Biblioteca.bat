@echo off
title Servidor de la Biblioteca
color 0b

echo ==============================================
echo      SISTEMA DE BIBLIOTECA INICIANDO...       
echo ==============================================
echo.
echo Por favor espere unos segundos...
echo.
echo (MINIMICE ESTA VENTANA NEGRA MIENTRAS TRABAJE)
echo (PARA APAGAR EL SISTEMA, SIMPLEMENTE CIERRELA)
echo.

cd /d "%~dp0"

:: Abrimos el navegador automáticamente despues de 3 segundos mientras el servidor arranca
start /b cmd /c "timeout /t 3 /nobreak > nul && start http://localhost:5173"

:: Inicializamos el sistema web en consola y lo mantenemos vivo expuesto a la red Wi-Fi
npm run dev -- --host
