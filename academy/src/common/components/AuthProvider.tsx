import { ACADEMY_VALIDATION_URL, COGNITO_AUTH_FLOW, COGNITO_CLIENT_ID } from '../../config';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {

  
 const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('token'); 
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(ACADEMY_VALIDATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
        },
        credentials: "omit",
        body: JSON.stringify({
          ClientId: COGNITO_CLIENT_ID,
          AuthFlow: COGNITO_AUTH_FLOW,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password
          }
        })
      });

      const data = await response.json();
      console.log("DynamoDB API Response Object:", data);

      if (response.ok && data.AuthenticationResult) {
        setIsAuthenticated(true);
        sessionStorage.setItem('access-token', data.AuthenticationResult.AccessToken);
        sessionStorage.setItem('id-token', data.AuthenticationResult.IdToken);
        
        return { success: true };
      } else {
        return { success: false, error: data.__type || "Invalid credentials" };
      }
    } catch (err: any) {
      console.error("Caught error inside login function:", err);
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('access-token');
    sessionStorage.removeItem('id-token');
    setIsAuthenticated(false); // 🚨 Reset the guard flag on logout
  };



  return (
    // 🚨 THE FIX: Pass isAuthenticated down inside the Provider value bundle
    <AuthContext.Provider value={{  isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getAccessToken = () => sessionStorage.getItem('access-token'); 

export const getIdToken = () => sessionStorage.getItem('id-token'); 

export const useAuth = () => {
  return useContext(AuthContext);
};
