#!/bin/bash
# Complete E-Commerce Setup and Run Guide
# This script helps you start all services in the correct order

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     E-Commerce MERN Stack - Complete Setup & Run Guide        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Starting MongoDB in Docker...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker-compose up -d
sleep 5
docker ps | grep ecommerce_mongodb
echo ""

echo -e "${YELLOW}Step 2: Check MongoDB is Running${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker exec ecommerce_mongodb mongosh --version
echo ""

echo -e "${GREEN}✅ MongoDB is ready!${NC}"
echo ""
echo -e "${BLUE}Next Steps (run in separate terminals):${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Seed Database:${NC}"
echo "cd ecommerce-backend && npm run seed"
echo ""
echo -e "${YELLOW}Terminal 2 - Start Backend:${NC}"
echo "cd ecommerce-backend && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 3 - Start Frontend:${NC}"
echo "cd ecommerce-frontend && npm start"
echo ""
echo -e "${GREEN}Then visit: http://localhost:3000${NC}"
