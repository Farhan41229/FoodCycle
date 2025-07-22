import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import auth from '../../firebase/firebase.init';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  deleteUser, // ← import deleteUser
} from 'firebase/auth';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [DBUser, setDBUser] = useState(null);
  const [UserLoading, setUserLoading] = useState(true);
  const [DBLoading, setDBLoading] = useState(true);

  const axiosSecure = UseAxiosSecure();

  const createUser = (email, password) => {
    setUserLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setUserLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const Logout = () => {
    setUserLoading(true);
    return signOut(auth);
  };

  const UpdateUserProfile = (profileInfo) =>
    updateProfile(auth.currentUser, profileInfo);

  /** Delete ONLY the Firebase authenticated user */
  const deleteAuthUser = async () => {
    if (!auth.currentUser) throw new Error('No authenticated user.');
    await deleteUser(auth.currentUser);
    // Clear local state
    setUser(null);
    setDBUser(null);
  };

  /* ---------------- watch auth state ---------------- */
  useEffect(() => {
    let isMounted = true;

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

      setUser(currentUser);
      setUserLoading(false);

      if (currentUser?.email) {
        setDBLoading(true);
        try {
          const email = currentUser.email.toLowerCase();
          const res = await axiosSecure.get(`/users?email=${email}`);
          if (!isMounted) return;
          setDBUser(res.data?.[0] ?? null);
        } catch (err) {
          console.error('Error fetching user from DB:', err);
          if (isMounted) setDBUser(null);
        } finally {
          if (isMounted) setDBLoading(false);
        }
      } else {
        setDBUser(null);
        setDBLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [axiosSecure]);

  const authInfo = {
    user,
    DBUser,
    UserLoading,
    DBLoading,
    createUser,
    signIn,
    Logout,
    UpdateUserProfile,
    deleteAuthUser, // ← exposed
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
