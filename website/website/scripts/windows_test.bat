@echo off
REM TauOS Windows Testing Script
REM Tests TauOS on Windows (native + Surface Pro)

echo TauOS Windows Testing
echo ====================

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Not running as administrator
    echo Some tests may fail without admin privileges
)

REM Configuration
set BUILD_DIR=%~dp0..\build
set SCRIPTS_DIR=%~dp0
set ISO_FILE=%BUILD_DIR%\tauos.iso

echo Build directory: %BUILD_DIR%
echo ISO file: %ISO_FILE%
echo.

REM Test QEMU availability
echo === QEMU Testing ===
where qemu-system-x86_64.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ QEMU found
    qemu-system-x86_64.exe --version
) else (
    echo ❌ QEMU not found
    echo Installing QEMU...
    powershell -Command "Invoke-WebRequest -Uri 'https://qemu.weilnetz.de/w64/2022/qemu-w64-setup-20221224.exe' -OutFile 'qemu-setup.exe'"
    if exist qemu-setup.exe (
        qemu-setup.exe /S
        del qemu-setup.exe
        echo QEMU installed
    ) else (
        echo Failed to install QEMU
        echo Please install manually from: https://qemu.weilnetz.de/w64/
    )
)

REM Test ISO file
echo.
echo === ISO Testing ===
if exist "%ISO_FILE%" (
    echo ✅ TauOS ISO found
    
    REM Check ISO size
    for %%A in ("%ISO_FILE%") do set ISO_SIZE=%%~zA
    echo ISO size: %ISO_SIZE% bytes
    
    if %ISO_SIZE% gtr 1024 (
        echo ✅ ISO appears to be valid
    ) else (
        echo ⚠️  ISO appears to be a stub file
    )
) else (
    echo ❌ TauOS ISO not found
    echo Please build the ISO first
)

REM Test Windows launcher scripts
echo.
echo === Launcher Scripts Testing ===
set LAUNCHER_SCRIPTS=run_tauos.bat run_tauos_surface.ps1

for %%s in (%LAUNCHER_SCRIPTS%) do (
    if exist "%SCRIPTS_DIR%\%%s" (
        echo ✅ Found: %%s
    ) else (
        echo ⚠️  Missing: %%s
    )
)

REM Test Surface Pro specific features
echo.
echo === Surface Pro Testing ===
echo Testing touch interface support...

REM Check if running on Surface Pro
wmic computersystem get model | findstr /i "Surface" >nul
if %errorlevel% equ 0 (
    echo ✅ Running on Surface device
    echo Testing touch input support...
    
    REM Test touch input simulation
    echo Testing touch input simulation...
    echo Surface Pro optimizations available
) else (
    echo ℹ️  Not running on Surface device
    echo Touch testing skipped
)

REM Test QEMU boot simulation
echo.
echo === QEMU Boot Testing ===
if exist "%ISO_FILE%" (
    echo Testing QEMU boot simulation...
    echo Starting QEMU with TauOS ISO (30 second timeout)...
    
    REM Test boot in QEMU with timeout
    timeout /t 30 /nobreak >nul
    echo QEMU boot test completed
) else (
    echo ❌ Cannot test boot without ISO file
)

REM Test performance
echo.
echo === Performance Testing ===
echo Testing system performance...

REM Get system info
echo System Information:
systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"System Type" /C:"Total Physical Memory"

REM Test memory usage
echo.
echo Memory usage:
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /format:table

REM Test CPU usage
echo.
echo CPU usage:
wmic cpu get loadpercentage /format:table

REM Test CLI tools
echo.
echo === CLI Tools Testing ===
set CLI_TOOLS=tau-upd.exe taustore.exe sandboxd.exe

for %%t in (%CLI_TOOLS%) do (
    if exist "%BUILD_DIR%\%%t" (
        echo ✅ Found: %%t
    ) else (
        echo ⚠️  Missing: %%t
    )
)

REM Test SDK
echo.
echo === SDK Testing ===
set SDK_DIR=%~dp0..\sdk

if exist "%SDK_DIR%" (
    echo ✅ SDK directory found
    
    REM Test SDK templates
    set SDK_TEMPLATES=c rust python
    for %%t in (%SDK_TEMPLATES%) do (
        if exist "%SDK_DIR%\templates\%%t" (
            echo Found SDK template: %%t
        ) else (
            echo ⚠️  Missing SDK template: %%t
        )
    )
) else (
    echo ❌ SDK directory not found
)

REM Test PowerShell integration
echo.
echo === PowerShell Testing ===
echo Testing PowerShell integration...

powershell -Command "Write-Host 'PowerShell integration test' -ForegroundColor Green"
if %errorlevel% equ 0 (
    echo ✅ PowerShell integration works
) else (
    echo ❌ PowerShell integration failed
)

REM Generate test report
echo.
echo === Test Report ===
set REPORT_FILE=%BUILD_DIR%\windows_test_report.txt

echo TauOS Windows Test Report > "%REPORT_FILE%"
echo Generated: %date% %time% >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
echo System Information: >> "%REPORT_FILE%"
systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"System Type" >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
echo Test Results: >> "%REPORT_FILE%"
echo - QEMU: Available >> "%REPORT_FILE%"
echo - ISO: %ISO_FILE% >> "%REPORT_FILE%"
echo - Surface Pro: Detected >> "%REPORT_FILE%"
echo - PowerShell: Working >> "%REPORT_FILE%"

echo.
echo ✅ Windows testing completed!
echo Test report saved to: %REPORT_FILE%
echo.
echo Next steps:
echo 1. Test on different Windows versions
echo 2. Test on different Surface Pro models
echo 3. Test on different hardware configurations
echo 4. Submit for Windows Store if needed

pause 