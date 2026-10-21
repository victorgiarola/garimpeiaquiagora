@echo off
chcp 65001 > nul
title Garimpei Aqui Agora - Sincronização de Ofertas em Tempo Real
cls

echo ===================================================================
echo   ⛏️  GARIMPEI AQUI AGORA - SINCRONIZADOR DE OFERTAS EM TEMPO REAL
echo ===================================================================
echo.
echo [1/3] Verificando conexao com o Minerador do Mercado Livre (Porta 3001)...
curl -s http://localhost:3001/api/categories > nul
if %errorlevel% neq 0 (
    echo [AVISO] O Minerador em projeto2\minerador-mercadolivre nao respondeu na porta 3001.
    echo Certifique-se de que o minerador esteja iniciado.
    echo.
) else (
    echo [OK] Minerador oficial conectado e operando em tempo real!
)

echo.
echo [2/3] Executando garimpagem e atualizacao do catalogo de ofertas...
node crawler.js

echo.
echo [3/3] Iniciando monitor automatico (daemon)...
echo As ofertas serao atualizadas e publicadas no site automaticamente.
echo Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.
node daemon.js
pause
