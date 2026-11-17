import React from "react";
import { ActivityIndicator } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../contexts/AuthContext";

type ThemedProps = { theme: DefaultTheme };

interface OrientlyTopBarProps {
  showLogout?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

export function OrientlyTopBar({
  showLogout = false,
  onLogout,
  isLoggingOut = false,
}: OrientlyTopBarProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const firstName = user?.name ? user.name.trim().split(" ")[0] : "Visitante";

  return (
    <BarContainer topInset={insets.top}>
      <BarRow>
        <BrandRow>
          <BrandBadge>
            <Feather name="compass" size={18} color="#FFFFFF" />
          </BrandBadge>
          <BrandTitle>Oriently</BrandTitle>
        </BrandRow>

        <ActionsRow>
          <AvatarWrapper>
            {user?.photo ? (
              <UserPhoto
                source={{ uri: user.photo }}
                accessibilityLabel={`Foto de perfil de ${firstName}`}
              />
            ) : (
              <UserAvatarFallback>
                <UserIcon name="person" />
              </UserAvatarFallback>
            )}
          </AvatarWrapper>

          {showLogout && onLogout && (
            <LogoutButton
              onPress={onLogout}
              disabled={isLoggingOut}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              accessibilityHint="Encerra sua sessão atual"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#1e355e" />
              ) : (
                <LogoutIcon name="logout" />
              )}
            </LogoutButton>
          )}
        </ActionsRow>
      </BarRow>
    </BarContainer>
  );
}

const BarContainer = styled.View<{ topInset: number }>`
  width: 100%;
  background-color: #f9f9ff;
  padding-top: ${({ topInset }: { topInset: number }) => topInset + 10}px;
  padding-bottom: 10px;
  padding-horizontal: 20px;
`;

const BarRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const BrandBadge = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: #005bb1;
  align-items: center;
  justify-content: center;
  shadow-color: #005bb1;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.22;
  shadow-radius: 8px;
  elevation: 3;
`;

const BrandTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 20px;
  color: #0f1b32;
  letter-spacing: -0.4px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const AvatarWrapper = styled.View`
  width: 34px;
  height: 34px;
`;

const UserPhoto = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  border-width: 1.5px;
  border-color: #d6e3ff;
`;

const UserAvatarFallback = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: #005bb1;
  align-items: center;
  justify-content: center;
`;

const UserIcon = styled(MaterialIcons)`
  font-size: 18px;
  color: #ffffff;
`;

const LogoutButton = styled.TouchableOpacity`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: #e9edff;
  align-items: center;
  justify-content: center;
`;

const LogoutIcon = styled(MaterialIcons)`
  font-size: 17px;
  color: #1e355e;
`;
