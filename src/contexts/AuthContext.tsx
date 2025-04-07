import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

interface UserData {
  name: string;
  email: string;
  photo: string;
}

interface AuthContextData {
  user: UserData | null;
  isLoading: boolean;
  signIn: (userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
}

// Criando o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Chaves para o AsyncStorage
const USER_STORAGE_KEY = "@Oriently:user";

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do usuário do AsyncStorage
  useEffect(() => {
    async function loadStoredData() {
      try {
        setIsLoading(true);
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("Usuário carregado do armazenamento local");
        }
      } catch (error) {
        console.error("Erro ao carregar dados armazenados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, []);

  // Função para fazer login e salvar dados do usuário
  async function signIn(userData: UserData) {
    try {
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      setUser(userData);
      console.log("Usuário logado e dados salvos com sucesso");
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados do usuário");
    }
  }

  // Função para fazer logout
  async function signOut() {
    try {
      setIsLoading(true);

      try {
        await GoogleSignin.signOut();
        console.log("Logout do Google realizado com sucesso");
      } catch (error) {
        console.log("Erro ao fazer logout do Google:", error);
      }

      // Remover dados do AsyncStorage
      await AsyncStorage.removeItem(USER_STORAGE_KEY);

      setUser(null);
      console.log("Usuário deslogado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout corretamente");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }

  return context;
}
