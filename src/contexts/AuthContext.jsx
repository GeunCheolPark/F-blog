import React, { createContext, useContext, useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [octokit, setOctokit] = useState(null);

  // 저장된 토큰이 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      loginWithToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  // GitHub 토큰으로 로그인
  async function loginWithToken(token) {
    try {
      const octokitInstance = new Octokit({ auth: token });
      
      // 유저 정보 가져오기
      const { data } = await octokitInstance.users.getAuthenticated();
      
      setCurrentUser(data);
      setOctokit(octokitInstance);
      localStorage.setItem('github_token', token);
      
      return data;
    } catch (error) {
      console.error('GitHub 인증 오류:', error);
      localStorage.removeItem('github_token');
      return null;
    } finally {
      setLoading(false);
    }
  }

  // 로그아웃
  function logout() {
    setCurrentUser(null);
    setOctokit(null);
    localStorage.removeItem('github_token');
  }

  const value = {
    currentUser,
    octokit,
    loginWithToken,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}