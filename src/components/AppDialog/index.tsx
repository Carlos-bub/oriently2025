import React from "react";
import { Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import {
  DialogVariant,
  ModalOverlay,
  ModalContent,
  ModalScroll,
  IconBadge,
  DialogTitle,
  DialogMessage,
  DetailsCard,
  DetailsTitle,
  DetailsRow,
  DetailsText,
  ButtonsRow,
  DialogButton,
  DialogButtonText,
} from "./styles";

export interface DialogAction {
  label: string;
  tone?: "primary" | "danger" | "secondary";
  onPress?: () => void | Promise<void>;
}

export interface DialogDetails {
  title: string;
  date?: string;
  time?: string;
}

export interface DialogConfig {
  title: string;
  message: string;
  variant?: DialogVariant;
  details?: DialogDetails;
  actions?: DialogAction[];
  dismissable?: boolean;
}

interface AppDialogProps {
  visible: boolean;
  config: DialogConfig | null;
  onDismiss: () => void;
}

const ICON_MAP: Record<
  DialogVariant,
  { name: keyof typeof Feather.glyphMap; color: string }
> = {
  info: { name: "info", color: "#258BFF" },
  success: { name: "check-circle", color: "#15803D" },
  warning: { name: "alert-triangle", color: "#D97706" },
  danger: { name: "alert-circle", color: "#DC2626" },
};

export function AppDialog({ visible, config, onDismiss }: AppDialogProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  if (!config) return null;

  const variant: DialogVariant = config.variant || "info";
  const iconSpec = ICON_MAP[variant];
  const actions: DialogAction[] =
    config.actions && config.actions.length > 0
      ? config.actions
      : [{ label: "OK", tone: "primary" }];

  const handleActionPress = async (action: DialogAction) => {
    onDismiss();
    if (action.onPress) {
      await action.onPress();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (config.dismissable !== false) {
          onDismiss();
        }
      }}
    >
      <ModalOverlay topInset={insets.top} bottomInset={insets.bottom}>
        <ModalContent>
          <ModalScroll>
            <IconBadge variant={variant}>
              <Feather name={iconSpec.name} size={22} color={iconSpec.color} />
            </IconBadge>

            <DialogTitle>{config.title}</DialogTitle>
            <DialogMessage>{config.message}</DialogMessage>

            {config.details && (
              <DetailsCard>
                <DetailsTitle numberOfLines={2}>
                  {config.details.title}
                </DetailsTitle>

                {config.details.date && (
                  <DetailsRow>
                    <Feather
                      name="calendar"
                      size={13}
                      color={theme.colors.primary_dark}
                    />
                    <DetailsText>{config.details.date}</DetailsText>
                  </DetailsRow>
                )}

                {config.details.time && (
                  <DetailsRow>
                    <Feather
                      name="clock"
                      size={13}
                      color={theme.colors.lavender}
                    />
                    <DetailsText>{config.details.time}</DetailsText>
                  </DetailsRow>
                )}
              </DetailsCard>
            )}

            <ButtonsRow single={actions.length === 1}>
              {actions.map((action, index) => {
                const tone =
                  action.tone ||
                  (actions.length === 1 || index === actions.length - 1
                    ? "primary"
                    : "secondary");
                return (
                  <DialogButton
                    key={`${action.label}-${index}`}
                    tone={tone}
                    activeOpacity={0.82}
                    onPress={() => handleActionPress(action)}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                  >
                    <DialogButtonText tone={tone}>
                      {action.label}
                    </DialogButtonText>
                  </DialogButton>
                );
              })}
            </ButtonsRow>
          </ModalScroll>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
