import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = () => {
    if (auth.isMock) {
      setCurrentUser({ uid: "mock-user-123", email: "demo@example.com", displayName: "Demo User", getIdToken: async () => "mock-token" });
      return Promise.resolve();
    }
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    if (auth.isMock) {
      setCurrentUser(null);
      setProfile(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  const fetchProfile = async (user) => {
    try {
      const token = await user.getIdToken();
      // Ensure we hit the absolute localhost URL to avoid proxy issues if configured differently
      const resp = await fetch('http://localhost:5001/api/users/sync', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!resp.ok) throw new Error("Sync failed");
      const data = await resp.json();
      setProfile(data);
    } catch (e) {
      console.error("Profile sync failed", e);
      // Fallback profile for mock mode if backend sync fails
      if (auth.isMock) {
        setProfile({ 
          company_name: "Demo brand", 
          profile_complete: true,
          tracked_competitors: [
            { name: "Competitor A", url: "https://a.com" },
            { name: "Competitor B", url: "https://b.com" }
          ]
        });
      }
    }
  };

  useEffect(() => {
    if (auth.isMock) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    profile,
    loading,
    login,
    logout,
    refreshProfile: () => currentUser && fetchProfile(currentUser)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
