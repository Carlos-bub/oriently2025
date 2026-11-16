import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { configureApiAuth } from "../services/apiClient";
import { clearInviteesCache } from "../services/calendlyService";

export interface UserData {
  name: string;
  email: string;
  photo: string;
}

interface StoredSession {
  user: UserData;
  isDemo: boolean;
}

interface AuthContextData {
  user: UserData | null;
  idToken: string | null;
  isDemo: boolean;
  isLoading: boolean;
  signIn: (
    userData: UserData,
    googleIdToken?: string | null,
    demoMode?: boolean
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USER_STORAGE_KEY = "@Oriently:user";

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const idTokenRef = useRef<string | null>(null);
  const isDemoRef = useRef(false);

  const updateIdToken = useCallback((token: string | null) => {
    idTokenRef.current = token;
    setIdToken(token);
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);

      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.log("Erro ao fazer logout do Google:", error);
      }

      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      clearInviteesCache();
      updateIdToken(null);
      isDemoRef.current = false;
      setIsDemo(false);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout corretamente");
    } finally {
      setIsLoading(false);
    }
  }, [updateIdToken]);

  const refreshIdToken = useCallback(async (): Promise<string | null> => {
    if (isDemoRef.current) {
      return null;
    }

    try {
      const silentResult = await GoogleSignin.signInSilently();
      let freshToken =
        silentResult.type === "success" ? silentResult.data?.idToken ?? null : null;

      if (!freshToken) {
        const tokens = await GoogleSignin.getTokens();
        freshToken = tokens.idToken || null;
      }

      if (freshToken) {
        updateIdToken(freshToken);
        return freshToken;
      }
    } catch (error) {
      console.warn("Não foi possível renovar o Google ID Token:", error);
    }

    updateIdToken(null);
    return null;
  }, [updateIdToken]);

  useEffect(() => {
    configureApiAuth({
      getIdToken: () => idTokenRef.current,
      refreshIdToken,
      onUnauthorized: async () => {
        await signOut();
      },
    });

    return () => {
      configureApiAuth(null);
    };
  }, [refreshIdToken, signOut]);

  useEffect(() => {
    async function loadStoredData() {
      try {
        setIsLoading(true);
        const rawStored = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (!rawStored) {
          return;
        }

        const parsed = JSON.parse(rawStored) as StoredSession | UserData;
        const storedUser = "user" in parsed ? parsed.user : parsed;
        const storedIsDemo = "isDemo" in parsed ? Boolean(parsed.isDemo) : false;

        if (storedIsDemo) {
          isDemoRef.current = true;
          setIsDemo(true);
          updateIdToken(null);
          setUser(storedUser);
          return;
        }

        // Nunca considerar dados locais como prova de autenticação: exige ID Token válido do Google
        isDemoRef.current = false;
        const freshToken = await refreshIdToken();
        if (freshToken) {
          setIsDemo(false);
          setUser(storedUser);
        } else {
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
          updateIdToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados armazenados:", error);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
        updateIdToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, [refreshIdToken, updateIdToken]);

  const signIn = useCallback(
    async (
      userData: UserData,
      googleIdToken?: string | null,
      demoMode = false
    ) => {
      try {
        if (!demoMode && !googleIdToken) {
          throw new Error("Google ID Token ausente na autenticação.");
        }

        const sessionToPersist: StoredSession = {
          user: userData,
          isDemo: demoMode,
        };

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(sessionToPersist)
        );

        isDemoRef.current = demoMode;
        setIsDemo(demoMode);
        updateIdToken(demoMode ? null : googleIdToken || null);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao salvar dados do usuário:", error);
        Alert.alert("Erro", "Não foi possível concluir a autenticação.");
      }
    },
    [updateIdToken]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        isDemo,
        isLoading,
        signIn,
        signOut,
        refreshIdToken,
      }}
    >
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
