// TauMail API Configuration
// Switch between Next.js API routes and Express.js backend

const API_CONFIG = {
  // Set to 'express' to use the new Express.js backend
  // Set to 'nextjs' to use the old Next.js API routes
  backend: 'express',
  
  // Express.js backend configuration
  express: {
    baseUrl: 'http://localhost:3001/api/v2',
    endpoints: {
      inbox: '/emails/inbox',
      sent: '/emails/sent',
      send: '/emails/send',
      webhook: '/webhook/incoming',
      health: '/health'
    }
  },
  
  // Next.js API routes configuration
  nextjs: {
    baseUrl: '',
    endpoints: {
      inbox: '/api/taumail/emails/inbox',
      sent: '/api/taumail/emails/sent',
      send: '/api/taumail/emails/send',
      webhook: '/api/taumail/webhook/incoming',
      health: '/api/health'
    }
  }
};

// Get current configuration
export const getApiConfig = () => {
  const config = API_CONFIG[API_CONFIG.backend];
  return {
    baseUrl: config.baseUrl,
    endpoints: config.endpoints
  };
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  const config = getApiConfig();
  return `${config.baseUrl}${config.endpoints[endpoint]}`;
};

// API client functions
export const taumailApi = {
  // Get inbox emails
  async getInbox() {
    const url = buildApiUrl('inbox');
    console.log('📧 Fetching inbox from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${localStorage.getItem('tauos_token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
  
  // Get sent emails
  async getSent() {
    const url = buildApiUrl('sent');
    console.log('📤 Fetching sent emails from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
  
  // Send email
  async sendEmail(emailData) {
    const url = buildApiUrl('send');
    console.log('📤 Sending email to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
  
  // Health check
  async healthCheck() {
    const url = buildApiUrl('health');
    console.log('❤️ Health check:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

export default taumailApi;
