#!/bin/bash

# TauOS Email Server Test Script
# This script tests the complete email server functionality

set -e

echo "🧪 Testing TauOS Email Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_dns() {
    echo -e "\n${YELLOW}📡 Testing DNS Resolution...${NC}"
    
    # Test smtp.tauos.org
    if nslookup smtp.tauos.org >/dev/null 2>&1; then
        echo -e "${GREEN}✅ smtp.tauos.org resolves${NC}"
        SMTP_RESOLVED=true
    else
        echo -e "${RED}❌ smtp.tauos.org not resolving yet${NC}"
        SMTP_RESOLVED=false
    fi
    
    # Test imap.tauos.org
    if nslookup imap.tauos.org >/dev/null 2>&1; then
        echo -e "${GREEN}✅ imap.tauos.org resolves${NC}"
        IMAP_RESOLVED=true
    else
        echo -e "${RED}❌ imap.tauos.org not resolving yet${NC}"
        IMAP_RESOLVED=false
    fi
}

test_ports() {
    echo -e "\n${YELLOW}🔌 Testing Port Connectivity...${NC}"
    
    # Test SMTP port
    if nc -z 44.221.133.77 587 2>/dev/null; then
        echo -e "${GREEN}✅ SMTP port 587 is open${NC}"
        SMTP_PORT=true
    else
        echo -e "${RED}❌ SMTP port 587 is closed${NC}"
        SMTP_PORT=false
    fi
    
    # Test IMAP port
    if nc -z 44.221.133.77 993 2>/dev/null; then
        echo -e "${GREEN}✅ IMAP port 993 is open${NC}"
        IMAP_PORT=true
    else
        echo -e "${RED}❌ IMAP port 993 is closed${NC}"
        IMAP_PORT=false
    fi
    
    # Test SSH port
    if nc -z 44.221.133.77 22 2>/dev/null; then
        echo -e "${GREEN}✅ SSH port 22 is open${NC}"
        SSH_PORT=true
    else
        echo -e "${RED}❌ SSH port 22 is closed${NC}"
        SSH_PORT=false
    fi
}

test_smtp() {
    echo -e "\n${YELLOW}📧 Testing SMTP Connection...${NC}"
    
    if [ "$SMTP_RESOLVED" = true ]; then
        # Test SMTP with domain name
        if echo "EHLO smtp.tauos.org" | nc smtp.tauos.org 587 2>/dev/null | grep -q "250"; then
            echo -e "${GREEN}✅ SMTP server responding (domain)${NC}"
            SMTP_WORKING=true
        else
            echo -e "${RED}❌ SMTP server not responding (domain)${NC}"
            SMTP_WORKING=false
        fi
    else
        # Test SMTP with IP
        if echo "EHLO smtp.tauos.org" | nc 44.221.133.77 587 2>/dev/null | grep -q "250"; then
            echo -e "${GREEN}✅ SMTP server responding (IP)${NC}"
            SMTP_WORKING=true
        else
            echo -e "${RED}❌ SMTP server not responding (IP)${NC}"
            SMTP_WORKING=false
        fi
    fi
}

test_imap() {
    echo -e "\n${YELLOW}📥 Testing IMAP Connection...${NC}"
    
    if [ "$IMAP_RESOLVED" = true ]; then
        # Test IMAP with domain name
        if echo "a001 LOGIN test@tauos.org tauostest2024!" | nc imap.tauos.org 993 2>/dev/null | grep -q "OK"; then
            echo -e "${GREEN}✅ IMAP server responding (domain)${NC}"
            IMAP_WORKING=true
        else
            echo -e "${RED}❌ IMAP server not responding (domain)${NC}"
            IMAP_WORKING=false
        fi
    else
        # Test IMAP with IP
        if echo "a001 LOGIN test@tauos.org tauostest2024!" | nc 44.221.133.77 993 2>/dev/null | grep -q "OK"; then
            echo -e "${GREEN}✅ IMAP server responding (IP)${NC}"
            IMAP_WORKING=true
        else
            echo -e "${RED}❌ IMAP server not responding (IP)${NC}"
            IMAP_WORKING=false
        fi
    fi
}

test_web_interface() {
    echo -e "\n${YELLOW}🌐 Testing Web Interface...${NC}"
    
    # Test HTTP
    if curl -s http://44.221.133.77 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Web interface responding (HTTP)${NC}"
        WEB_HTTP=true
    else
        echo -e "${RED}❌ Web interface not responding (HTTP)${NC}"
        WEB_HTTP=false
    fi
    
    # Test HTTPS
    if curl -k -s https://44.221.133.77 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Web interface responding (HTTPS)${NC}"
        WEB_HTTPS=true
    else
        echo -e "${RED}❌ Web interface not responding (HTTPS)${NC}"
        WEB_HTTPS=false
    fi
}

generate_report() {
    echo -e "\n${YELLOW}📊 Test Results Summary:${NC}"
    echo "=================================="
    
    echo -e "DNS Resolution:"
    echo -e "  smtp.tauos.org: $([ "$SMTP_RESOLVED" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    echo -e "  imap.tauos.org: $([ "$IMAP_RESOLVED" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    
    echo -e "\nPort Connectivity:"
    echo -e "  SMTP (587): $([ "$SMTP_PORT" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    echo -e "  IMAP (993): $([ "$IMAP_PORT" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    echo -e "  SSH (22): $([ "$SSH_PORT" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    
    echo -e "\nEmail Services:"
    echo -e "  SMTP Server: $([ "$SMTP_WORKING" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    echo -e "  IMAP Server: $([ "$IMAP_WORKING" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    
    echo -e "\nWeb Interface:"
    echo -e "  HTTP: $([ "$WEB_HTTP" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    echo -e "  HTTPS: $([ "$WEB_HTTPS" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    
    echo -e "\n${YELLOW}🎯 Next Steps:${NC}"
    if [ "$SMTP_WORKING" = true ] && [ "$IMAP_WORKING" = true ]; then
        echo -e "${GREEN}🎉 Email server is fully operational!${NC}"
        echo -e "You can now:"
        echo -e "  1. Configure email clients to use smtp.tauos.org and imap.tauos.org"
        echo -e "  2. Update TauMail web app configuration"
        echo -e "  3. Test sending and receiving emails"
    else
        echo -e "${RED}⚠️  Some services need attention${NC}"
        echo -e "Please check:"
        echo -e "  1. DNS propagation (may take 5-15 minutes)"
        echo -e "  2. Server configuration"
        echo -e "  3. Firewall settings"
    fi
}

# Run all tests
test_dns
test_ports
test_smtp
test_imap
test_web_interface
generate_report

echo -e "\n${GREEN}✅ Test completed!${NC}" 