import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthState {
  token: string;
  responseUser: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  loading: boolean;
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, responseUser] = await AsyncStorage.multiGet([
        '@Gobarber:token',
        '@Gobarber:user',
      ]);

      if (token[1] && responseUser[1]) {
        setData({token: token[1], responseUser: JSON.parse(responseUser[1])});
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);

    setData({} as AuthState);
  }, []);

  const signIn = useCallback(async ({email, password}) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const {token, responseUser} = response.data;

    await AsyncStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(responseUser)],
    ]);

    setData({token, responseUser});
  }, []);

  return (
    <AuthContext.Provider
      value={{user: data.responseUser, signIn, signOut, loading}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must br used within an AuthProvider');
  }
  return context;
}
