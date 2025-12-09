// Mock authentication for development when backend is not available
// This allows testing the frontend without a backend server

export const mockRegister = async (userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful registration
  const mockUser = {
    _id: 'mock_' + Date.now(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
    university: userData.university,
    campus: userData.campus,
    phone: userData.phone || '',
    createdAt: new Date().toISOString()
  };
  
  const mockToken = 'mock_token_' + Date.now();
  
  return {
    token: mockToken,
    user: mockUser
  };
};

export const mockLogin = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful login
  const mockUser = {
    _id: 'mock_user_123',
    name: 'Test User',
    email: email,
    role: 'seller',
    university: 'University of Ghana',
    campus: 'Legon Campus',
    phone: '+233 24 123 4567'
  };
  
  const mockToken = 'mock_token_' + Date.now();
  
  return {
    token: mockToken,
    user: mockUser
  };
};

export const isBackendAvailable = async () => {
  try {
    // Try to make a simple request to check if backend is available
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

