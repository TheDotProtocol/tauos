#!/bin/bash

# Enhanced TauOS Marketing Demo
clear

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Animated welcome
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🐢 TauOS Marketing Demo                   ║"
echo "║                                                              ║"
echo "║              Gateway to the Future of Computing              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Welcome message
echo -e "${GREEN}Welcome to TauOS!${NC}"
echo "This is a demonstration of the TauOS operating system."
echo ""

# Features with colors
echo -e "${YELLOW}✨ Key Features:${NC}"
echo -e "  ${GREEN}✅${NC} Modern UI with TauOS design language"
echo -e "  ${GREEN}✅${NC} Privacy-first architecture"
echo -e "  ${GREEN}✅${NC} Built-in TauMail and TauCloud"
echo -e "  ${GREEN}✅${NC} Cross-platform compatibility"
echo -e "  ${GREEN}✅${NC} Zero telemetry"
echo -e "  ${GREEN}✅${NC} End-to-end encryption"
echo ""

# System information
echo -e "${BLUE}🔧 System Information:${NC}"
echo -e "  ${CYAN}Architecture:${NC} x86_64"
echo -e "  ${CYAN}Kernel:${NC} Linux 6.6.30"
echo -e "  ${CYAN}Desktop:${NC} GTK4 with custom theming"
echo -e "  ${CYAN}Security:${NC} Sandboxed applications"
echo -e "  ${CYAN}Updates:${NC} OTA with signature verification"
echo ""

echo -e "${PURPLE}Press Enter to continue...${NC}"
read

# Loading animation
echo ""
echo -e "${YELLOW}🚀 Starting TauOS desktop environment...${NC}"
for i in {1..3}; do
    echo -e "  ${GREEN}Loading...${NC}"
    sleep 0.5
done

echo ""
echo -e "${BLUE}📧 Loading TauMail...${NC}"
echo -e "${BLUE}☁️  Loading TauCloud...${NC}"
echo -e "${BLUE}🔒 Loading system services...${NC}"
echo ""

# Success message
echo -e "${GREEN}🐢 TauOS is ready!${NC}"
echo ""

echo -e "${CYAN}This is a marketing demonstration.${NC}"
echo -e "${CYAN}For the full experience, visit: ${YELLOW}https://tauos.org${NC}"
echo ""

echo -e "${PURPLE}Press Enter to exit...${NC}"
read

# Exit with style
clear
echo -e "${GREEN}Thank you for experiencing TauOS! 🐢${NC}"
