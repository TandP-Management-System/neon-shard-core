import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'department' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo dataset
const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@saas.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'dept1@saas.com',
    name: 'Computer Science Dept',
    role: 'department',
  },
  {
    id: '3',
    email: 'dept2@saas.com',
    name: 'Mathematics Dept',
    role: 'department',
  },
  {
    id: '4',
    email: 'student1@saas.com',
    name: 'John Doe',
    role: 'student',
  },
  {
    id: '5',
    email: 'student2@saas.com',
    name: 'Jane Smith',
    role: 'student',
  },
  {
    id: '6',
    email: 'student3@saas.com',
    name: 'Mike Johnson',
    role: 'student',
  },
];

// For demo purposes, password is "password123" for all users
const DEMO_PASSWORD = 'password123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password !== DEMO_PASSWORD) {
      return false;
    }

    const foundUser = demoUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
