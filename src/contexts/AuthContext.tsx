'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, AuthContextType, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if this is an admin email
  const isAdminEmail = (email: string): boolean => {
    const adminEmails = ['dijanatodorovic88@gmail.com', 'joshua@hyperglass.com.au'];
    return adminEmails.includes(email.toLowerCase());
  };

  // Get user data from Firestore
  const getUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name || firebaseUser.displayName || 'User',
          role: userData.role || (isAdminEmail(firebaseUser.email!) ? 'admin' : 'customer'),
          avatar: userData.avatar,
          phone: userData.phone,
          address: userData.address,
          createdAt: userData.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
      } else {
        // Create user document if it doesn't exist
        const defaultRole = isAdminEmail(firebaseUser.email!) ? 'admin' : 'customer';
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'User',
          role: defaultRole,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  // Update last login time
  const updateLastLogin = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastLoginAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(result.user);
      
      if (userData) {
        await updateLastLogin(userData.uid);
        setUser(userData);
        toast({
          title: 'Welcome back!',
          description: `Signed in as ${userData.name}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message || 'Please check your credentials and try again.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string, role: UserRole = 'customer'): Promise<void> => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Override role for admin emails
      const finalRole = isAdminEmail(email) ? 'admin' : role;
      
      const newUser: User = {
        uid: result.user.uid,
        email: result.user.email!,
        name,
        role: finalRole,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newUser);
      setUser(newUser);
      
      toast({
        title: 'Account created!',
        description: `Welcome to Clean Freaks Co, ${name}!`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message || 'Please try again.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({
        title: 'Signed out',
        description: 'See you next time!',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: error.message,
      });
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password reset sent',
        description: 'Check your email for reset instructions.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset failed',
        description: error.message,
      });
      throw error;
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Only admins can update user roles');
      }
      
      await updateDoc(doc(db, 'users', uid), { role });
      
      toast({
        title: 'Role updated',
        description: `User role changed to ${role}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Role update failed',
        description: error.message,
      });
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
