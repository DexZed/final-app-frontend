import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";

import { createContext, useContext, useEffect, useState } from "react";
import app from "../auth/firebase";
import { api } from "../services/api";


export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
type AuthProvider = {
  children: React.ReactNode;
};

type AuthContextValue = {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateDetails: ({
    displayName,
    photoURL,
  }: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  userDetails: () => {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
  signUpAndUpdate: (
    email: string,
    password: string,
    details: { displayName?: string; photoURL?: string }
  ) => Promise<void>;
  googleAuth: () => Promise<UserCredential>;
  getAuthToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: AuthProvider) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const contextValue: AuthContextValue = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    updateDetails,
    userDetails,
    signUpAndUpdate,
    googleAuth,
    getAuthToken,
  };
  async function googleAuth() {
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  }
  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOut() {
    return auth.signOut();
  }

  function updateDetails({
    displayName,
    photoURL,
  }: {
    displayName?: string;
    photoURL?: string;
  }) {
    const user = ensureUser();
    return updateProfile(user, { displayName, photoURL });
  }

 async function signUpAndUpdate(
    email: string,
    password: string,
    details: { displayName?: string; photoURL?: string }
  ) {
    return signUp(email, password).then(() => {
      if (auth.currentUser) {
        return updateDetails(details);
      }
      throw new Error("User creation failed");
    });
  }

  function userDetails(): {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null {
    const user = auth.currentUser;
    if (!user) return null;
    const { displayName, email, photoURL } = user;
    return { displayName, email, photoURL };
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        try {
          const idToken = await user.getIdToken(); 
          await api.post(
            `/api/postSessions`,
            {}, 
            {
              headers: {
                Authorization: `Bearer ${idToken}`, 
                 
              },
            }
          );
        } catch (error) {
          console.error("Error sending token to backend:", error);
        }
      } else {
        
        try {
          await api.delete(`/api/delSessions`,);
        } catch (error) {
          console.error("Error clearing session on logout:", error);
        }
      }
      setCurrentUser(user || null);
      setLoading(false);
    });
  
    return unsubscribe;
  }, [])
  
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/api/getSessions");
        //console.log("Response from /api/getSessions:", res);
        if (res.status === 200) {
          //console.log("Session is valid:", res.data);
        } else {
          //console.log("No session detected");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        //console.log("Error has occurred");
      }
    };
  
    checkSession();
  }, []);
  
 

  function ensureUser() {
    if (!auth.currentUser) throw new Error("No user is logged in");
    return auth.currentUser;
  }

  async function getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    } else {
      console.error("No user is signed in.");
      return null;
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
