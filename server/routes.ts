import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Authentication middleware to check if the user has a valid session token
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Skip auth check for specific paths (login, API validation, assets)
  const noAuthPaths = [
    '/api/auth/validate-password',
    '/api/auth/check-protection',
    '/api/auth/get-current-password', // Development only, remove in production
    '/favicon.ico',
    '/assets/',
    '/_vite'
  ];

  // Skip auth for whitelisted paths, include all assets and vite resources
  if (noAuthPaths.some(path => req.path.startsWith(path)) || 
      req.path.includes('assets') || 
      req.path.includes('vite') || 
      req.path.includes('.js') || 
      req.path.includes('.css')) {
    // Skip auth for whitelisted paths
    return next();
  }

  // Skip auth for resources needed to load the page
  if (req.method === 'GET' && (
      req.path === '/' || 
      req.path === '/favicon.ico' || 
      req.path.startsWith('/_vite'))) {
    return next();
  }

  // Check if password protection is enabled
  const isProtectionEnabled = await storage.checkPasswordProtectionEnabled();
  if (!isProtectionEnabled) {
    // Password protection disabled, allow access
    return next();
  }

  // Get token from headers
  const token = req.headers['x-auth-token'] as string | undefined;
  
  // Validate token
  const isValidToken = await storage.validateSessionToken(token);
  
  // If no token or invalid token, reject the request
  if (!isValidToken) {
    // If this is an API request, return JSON error
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Unauthorized - Password required' });
    }
    
    // For non-API requests, serve the main HTML page
    // This allows the client-side routing to handle the password screen
    return next();
  }
  
  console.log(`Access granted for path: ${req.path}`);
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply authentication middleware to all requests
  app.use(requireAuth);
  
  // Authentication routes
  app.post('/api/auth/validate-password', async (req, res) => {
    try {
      console.log('Validating password request received');
      const { password } = req.body;
      
      if (!password) {
        console.log('No password provided in request');
        return res.status(400).json({ success: false, message: 'Password is required' });
      }
      
      console.log('Checking password validity');
      const isValid = await storage.validatePassword(password);
      
      if (isValid) {
        console.log('Password validated successfully');
        // Generate a session token
        const token = await storage.generateSessionToken(req.ip || 'unknown');
        console.log('Generated session token:', token);
        
        // Return success with token
        return res.status(200).json({ 
          success: true, 
          message: 'Password validated successfully',
          token 
        });
      } else {
        console.log('Invalid password provided');
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid password'
        });
      }
    } catch (error) {
      console.error('Error validating password:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error during validation'
      });
    }
  });
  
  // Check if password protection is enabled
  app.get('/api/auth/check-protection', async (req, res) => {
    try {
      const isEnabled = await storage.checkPasswordProtectionEnabled();
      return res.status(200).json({ 
        enabled: isEnabled
      });
    } catch (error) {
      console.error('Error checking password protection:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error checking protection status'
      });
    }
  });
  
  // Get current password (only for development/testing purposes)
  app.get('/api/auth/get-current-password', async (req, res) => {
    try {
      const password = await storage.getSitePassword();
      console.log('Current password is:', password);
      return res.status(200).json({ 
        password: password,
        note: 'This API is for development/testing only and should be removed in production'
      });
    } catch (error) {
      console.error('Error getting current password:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error getting current password'
      });
    }
  });
  
  // Admin routes to manage password settings
  app.post('/api/admin/password', async (req, res) => {
    try {
      const { password, enabled } = req.body;
      
      if (password !== undefined) {
        await storage.setSitePassword(password);
      }
      
      if (enabled !== undefined) {
        await storage.setPasswordProtection(enabled);
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Password settings updated'
      });
    } catch (error) {
      console.error('Error updating password settings:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error updating password settings'
      });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
