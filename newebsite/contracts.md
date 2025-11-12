# TauCore Landing Page - API Contracts

## Overview
The TauCore landing page is currently frontend-only with mock data. This document outlines the API contracts needed for backend integration.

## Current Frontend Implementation

### 1. Hero Section
- **Current**: Static content with tagline and 3D Spline animation
- **Mock Data**: Static stats (100% Encrypted, ∞ Scalable, ⚡ Lightning Fast)
- **Backend Needed**: None (static content)

### 2. Features Section
- **Current**: Static 4 pillars with icons and descriptions
- **Mock Data**: Hardcoded features array in `/components/Features.jsx`
- **Backend Needed**: None initially (could be made dynamic later)

### 3. Why TauCore Section
- **Current**: Static content with code-like visualization
- **Mock Data**: Hardcoded benefits array
- **Backend Needed**: None (static content)

### 4. Developer CTA Section
- **Current**: Static resources and stats
- **Mock Data**: Hardcoded stats (10K+ Developers, 50+ Contributors, etc.)
- **Backend API Needed**: 
  ```
  GET /api/stats
  Response: {
    developers: number,
    contributors: number,
    openSource: boolean,
    support: string
  }
  ```

### 5. Navigation & Contact Forms (Future)
- **Backend API Needed**:
  ```
  POST /api/contact
  Body: {
    name: string,
    email: string,
    message: string,
    type: 'early_access' | 'general'
  }
  Response: {
    success: boolean,
    message: string
  }
  ```

## Current Status
✅ **Frontend Complete**: All sections rendering with dark theme design system
✅ **3D Animation**: Spline neon balls animation working
✅ **Responsive Design**: Mobile and desktop optimized
✅ **Design System**: Following 90/10 color rule with black backgrounds

## Mock Data Location
- All mock data is currently hardcoded in component files
- No external mock.js file used as content is primarily static
- Dynamic stats could be made configurable via backend APIs

## Integration Notes
- The landing page is primarily static and doesn't require immediate backend integration
- Optional backend APIs could be added for dynamic stats and contact forms
- Current implementation focuses on design and user experience