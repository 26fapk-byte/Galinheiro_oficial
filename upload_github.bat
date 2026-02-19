@echo off
echo ==========================================
echo      AUTOMATIZADOR DE UPLOAD GITHUB
echo ==========================================
echo.

:: Tenta encontrar o Git em locais padrao
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_PATH=C:\Program Files\Git\cmd\git.exe"
) else if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
    set "GIT_PATH=C:\Program Files (x86)\Git\cmd\git.exe"
) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd\git.exe" (
    set "GIT_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd\git.exe"
) else (
    echo [ERRO] Git nao encontrado automaticamente.
    echo Por favor, reinstale o Git e marque a opcao "Add to PATH".
    pause
    exit /b
)

echo [OK] Git encontrado em: "%GIT_PATH%"
echo.

:: Configura usuario se nao tiver
"%GIT_PATH%" config user.name "Usuario Galinheiro"
"%GIT_PATH%" config user.email "galinheiro@exemplo.com"

echo [1/3] Adicionando arquivos...
"%GIT_PATH%" add .

echo [2/3] Criando commit...
"%GIT_PATH%" commit -m "Fix Vercel Build: tsconfig and vercel.json"

echo [3/3] Enviando para GitHub...
"%GIT_PATH%" push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ==========================================
    echo      SUCESSO! ARQUIVOS ENVIADOS!
    echo ==========================================
    echo O Vercel deve iniciar o deploy automaticamente agora.
) else (
    echo [ERRO] Falha no envio. Verifique se voce tem permissao no repositorio.
)

pause
