@echo off
REM TauOS Windows Setup Script
REM Sets up TauOS for Windows testing and deployment

echo TauOS Windows Setup
echo ===================

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo Please right-click and "Run as administrator"
    pause
    exit /b 1
)

REM Check if QEMU is installed
where qemu-system-x86_64.exe >nul 2>&1
if %errorlevel% neq 0 (
    echo QEMU not found. Installing QEMU...
    
    REM Download QEMU for Windows
    echo Downloading QEMU for Windows...
    powershell -Command "Invoke-WebRequest -Uri 'https://qemu.weilnetz.de/w64/2022/qemu-w64-setup-20221224.exe' -OutFile 'qemu-setup.exe'"
    
    if exist qemu-setup.exe (
        echo Installing QEMU...
        qemu-setup.exe /S
        del qemu-setup.exe
    ) else (
        echo Failed to download QEMU
        echo Please install QEMU manually from: https://qemu.weilnetz.de/w64/
        pause
        exit /b 1
    )
) else (
    echo QEMU is already installed
)

REM Create TauOS directory structure
if not exist "tauos" mkdir tauos
if not exist "tauos\build" mkdir tauos\build
if not exist "tauos\scripts" mkdir tauos\scripts

REM Copy Windows-specific scripts
echo Creating Windows launcher scripts...

REM Create main launcher
echo @echo off > tauos\run_tauos.bat
echo echo TauOS Windows Launcher >> tauos\run_tauos.bat
echo echo ==================== >> tauos\run_tauos.bat
echo. >> tauos\run_tauos.bat
echo REM Check if QEMU is available >> tauos\run_tauos.bat
echo where qemu-system-x86_64.exe ^>nul 2^>^&1 >> tauos\run_tauos.bat
echo if %%errorlevel%% neq 0 ^( >> tauos\run_tauos.bat
echo     echo ERROR: QEMU not found. Please install QEMU for Windows. >> tauos\run_tauos.bat
echo     pause >> tauos\run_tauos.bat
echo     exit /b 1 >> tauos\run_tauos.bat
echo ^) >> tauos\run_tauos.bat
echo. >> tauos\run_tauos.bat
echo REM Check if ISO exists >> tauos\run_tauos.bat
echo if not exist "build\tauos.iso" ^( >> tauos\run_tauos.bat
echo     echo ERROR: TauOS ISO not found. Please build the ISO first. >> tauos\run_tauos.bat
echo     pause >> tauos\run_tauos.bat
echo     exit /b 1 >> tauos\run_tauos.bat
echo ^) >> tauos\run_tauos.bat
echo. >> tauos\run_tauos.bat
echo echo Starting TauOS in QEMU... >> tauos\run_tauos.bat
echo echo. >> tauos\run_tauos.bat
echo. >> tauos\run_tauos.bat
echo REM Launch QEMU with TauOS ISO >> tauos\run_tauos.bat
echo qemu-system-x86_64.exe ^ >> tauos\run_tauos.bat
echo     -m 2048 ^ >> tauos\run_tauos.bat
echo     -smp 2 ^ >> tauos\run_tauos.bat
echo     -cdrom build\tauos.iso ^ >> tauos\run_tauos.bat
echo     -boot d ^ >> tauos\run_tauos.bat
echo     -enable-kvm ^ >> tauos\run_tauos.bat
echo     -vga virtio ^ >> tauos\run_tauos.bat
echo     -cpu host ^ >> tauos\run_tauos.bat
echo     -machine type=q35,accel=kvm:tcg ^ >> tauos\run_tauos.bat
echo     -display gtk ^ >> tauos\run_tauos.bat
echo     -usb ^ >> tauos\run_tauos.bat
echo     -device usb-tablet ^ >> tauos\run_tauos.bat
echo     -net user ^ >> tauos\run_tauos.bat
echo     -net nic,model=virtio >> tauos\run_tauos.bat
echo. >> tauos\run_tauos.bat
echo echo. >> tauos\run_tauos.bat
echo echo TauOS session ended. >> tauos\run_tauos.bat
echo pause >> tauos\run_tauos.bat

REM Create Surface Pro launcher
echo # TauOS Surface Pro Launcher > tauos\run_tauos_surface.ps1
echo # Optimized for Surface Pro touch interface >> tauos\run_tauos_surface.ps1
echo. >> tauos\run_tauos_surface.ps1
echo Write-Host "TauOS Surface Pro Launcher" -ForegroundColor Green >> tauos\run_tauos_surface.ps1
echo Write-Host "==========================" -ForegroundColor Green >> tauos\run_tauos_surface.ps1
echo. >> tauos\run_tauos_surface.ps1
echo # Check if QEMU is available >> tauos\run_tauos_surface.ps1
echo if ^(-not ^(Get-Command qemu-system-x86_64.exe -ErrorAction SilentlyContinue^)^) ^{ >> tauos\run_tauos_surface.ps1
echo     Write-Host "ERROR: QEMU not found. Please install QEMU for Windows." -ForegroundColor Red >> tauos\run_tauos_surface.ps1
echo     Read-Host "Press Enter to continue" >> tauos\run_tauos_surface.ps1
echo     exit 1 >> tauos\run_tauos_surface.ps1
echo ^} >> tauos\run_tauos_surface.ps1
echo. >> tauos\run_tauos_surface.ps1
echo # Check if ISO exists >> tauos\run_tauos_surface.ps1
echo if ^(-not ^(Test-Path "build\tauos.iso"^)^) ^{ >> tauos\run_tauos_surface.ps1
echo     Write-Host "ERROR: TauOS ISO not found. Please build the ISO first." -ForegroundColor Red >> tauos\run_tauos_surface.ps1
echo     Read-Host "Press Enter to continue" >> tauos\run_tauos_surface.ps1
echo     exit 1 >> tauos\run_tauos_surface.ps1
echo ^} >> tauos\run_tauos_surface.ps1
echo. >> tauos\run_tauos_surface.ps1
echo Write-Host "Starting TauOS on Surface Pro..." -ForegroundColor Yellow >> tauos\run_tauos_surface.ps1
echo Write-Host "" >> tauos\run_tauos_surface.ps1
echo. >> tauos\run_tauos_surface.ps1
echo # Launch QEMU with Surface Pro optimizations >> tauos\run_tauos_surface.ps1
echo ^& qemu-system-x86_64.exe ` >> tauos\run_tauos_surface.ps1
echo     -m 4096 ` >> tauos\run_tauos_surface.ps1
echo     -smp 4 ` >> tauos\run_tauos_surface.ps1
echo     -cdrom build\tauos.iso ` >> tauos\run_tauos_surface.ps1
echo     -boot d ` >> tauos\run_tauos_surface.ps1
echo     -enable-kvm ` >> tauos\run_tauos_surface.ps1
echo     -vga virtio ` >> tauos\run_tauos_surface.ps1
echo     -cpu host ` >> tauos\run_tauos_surface.ps1
echo     -machine type=q35,accel=kvm:tcg ` >> tauos\run_tauos_surface.ps1
echo     -display gtk ` >> tauos\run_tauos_surface.ps1
echo     -usb ` >> tauos\run_tauos_surface.ps1
echo     -device usb-tablet ` >> tauos\run_tauos_surface.ps1
echo     -device usb-kbd ` >> tauos\run_tauos_surface.ps1
echo     -net user ` >> tauos\run_tauos_surface.ps1
echo     -net nic,model=virtio ` >> tauos\run_tauos_surface.ps1
echo     -device virtio-balloon ` >> tauos\run_tauos_surface.ps1
echo     -device virtio-rng-pci >> tauos\run_tauos_surface.ps1
echo. >> tauos\run_tauos_surface.ps1
echo Write-Host "" >> tauos\run_tauos_surface.ps1
echo Write-Host "TauOS session ended." -ForegroundColor Green >> tauos\run_tauos_surface.ps1
echo Read-Host "Press Enter to continue" >> tauos\run_tauos_surface.ps1

REM Create desktop shortcut
echo Creating desktop shortcut...
echo @echo off > "%USERPROFILE%\Desktop\TauOS.bat"
echo cd /d "%~dp0\tauos" >> "%USERPROFILE%\Desktop\TauOS.bat"
echo call run_tauos.bat >> "%USERPROFILE%\Desktop\TauOS.bat"

echo.
echo TauOS Windows setup completed!
echo.
echo Next steps:
echo 1. Copy the TauOS ISO to tauos\build\tauos.iso
echo 2. Double-click the TauOS shortcut on your desktop
echo 3. Or run tauos\run_tauos.bat directly
echo.
echo For Surface Pro users, use tauos\run_tauos_surface.ps1
echo.
pause 