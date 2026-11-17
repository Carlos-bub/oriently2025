import React, { useState } from "react";
import { ActivityIndicator, Linking, Share } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../contexts/AuthContext";
import { useDialog } from "../../contexts/DialogContext";
import {
  cancelEvent,
  getEventInvitees,
} from "../../services/calendlyService";
import { CalendlyEvent } from "../../services/types";

import {
  Container,
  TopBar,
  TopBarLeft,
  IconButton,
  TopBarTextCol,
  TopBarTitle,
  TopBarSubtitle,
  ScrollBody,
  Content,
  JourneyHeader,
  JourneyPill,
  JourneyPillText,
  EventHeadline,
  StatusRow,
  StatusPill,
  StatusDot,
  StatusPillText,
  CountdownText,
  SessionCard,
  SessionTopRow,
  CalendarBlock,
  CalendarMonth,
  CalendarDay,
  CalendarYear,
  SessionMetaCol,
  TimeRow,
  TimeText,
  DurationText,
  ModalityRow,
  ModalityText,
  LinkChip,
  LinkChipLeft,
  LinkChipText,
  PrimaryCallButton,
  PrimaryCallButtonText,
  SecondaryActionPill,
  SecondaryActionPillText,
  SectionHeaderRow,
  SectionDot,
  SectionTitle,
  ChecklistCard,
  ChecklistItem,
  CheckboxBox,
  ChecklistTextCol,
  ChecklistTitle,
  ChecklistMeta,
  CoachTipCard,
  CoachTipIconBox,
  CoachTipTitle,
  CoachTipBody,
  BottomActions,
  RescheduleButton,
  RescheduleButtonText,
  CancelButton,
  CancelButtonText,
  CancelReasonBox,
  CancelReasonBoxText,
} from "./styles";

type ChecklistEntry = {
  id: string;
  title: string;
  meta: string;
  checked: boolean;
};

const DEFAULT_AGENDA_ITEMS: ChecklistEntry[] = [
  {
    id: "1",
    title: "Revisar dúvidas e objetivos da etapa atual",
    meta: "Preparação prévia • 10 min",
    checked: true,
  },
  {
    id: "2",
    title: "Separar trechos, capítulos ou resultados para discussão",
    meta: "Material de apoio • 15 min",
    checked: false,
  },
  {
    id: "3",
    title: "Alinhar próximos passos e prazos de entrega",
    meta: "Cronograma do TCC • 5 min",
    checked: false,
  },
];

export function MeetingDetails() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showDialog } = useDialog();

  const event: CalendlyEvent | undefined = route.params?.event;
  const [canceling, setCanceling] = useState(false);
  const [agendaItems, setAgendaItems] =
    useState<ChecklistEntry[]>(DEFAULT_AGENDA_ITEMS);

  if (!event) {
    return (
      <Container>
        <TopBar topInset={insets.top}>
          <TopBarLeft>
            <IconButton
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Feather name="arrow-left" size={22} color="#0f1b32" />
            </IconButton>
            <TopBarTextCol>
              <TopBarTitle>Detalhes da Orientação</TopBarTitle>
            </TopBarTextCol>
          </TopBarLeft>
        </TopBar>
      </Container>
    );
  }

  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;
  const now = new Date();

  let variant: "active" | "completed" | "canceled" = "active";
  if (event.status === "canceled") {
    variant = "canceled";
  } else if (startDate.getTime() < now.getTime()) {
    variant = "completed";
  }

  const statusLabel =
    variant === "completed"
      ? "Realizada"
      : variant === "canceled"
        ? "Cancelada"
        : "Confirmada";

  const isUpcoming = variant === "active";

  const monthLabel = startDate
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  const dayLabel = String(startDate.getDate()).padStart(2, "0");
  const yearLabel = String(startDate.getFullYear());

  const startTimeLabel = startDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTimeLabel = endDate
    ? endDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;
  const durationMin = endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / 60000)
    : null;

  const getCountdownLabel = () => {
    if (variant === "canceled") return "• Reunião cancelada";
    if (variant === "completed") return "• Encontro concluído";

    const startDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round(
      (startDay.getTime() - today.getTime()) / 86400000
    );

    if (diffDays <= 0) return "• Hoje";
    if (diffDays === 1) return "• Amanhã";
    return `• Em ${diffDays} dias`;
  };

  const getLocationLabel = (): string => {
    if (!event.location) return "Orientação";
    if (event.location.location) return event.location.location;
    if (event.location.type === "google_conference") return "Google Meet";
    if (event.location.type === "zoom") return "Zoom";
    if (event.location.type === "microsoft_teams_conference") {
      return "Microsoft Teams";
    }
    if (event.location.join_url) return "Videoconferência";
    return "Orientação";
  };

  const joinUrl =
    event.location?.join_url && event.location.join_url.startsWith("https://")
      ? event.location.join_url
      : null;

  const displayJoinUrl = joinUrl
    ? joinUrl.replace(/^https?:\/\//, "")
    : null;

  const handleOpenJoinUrl = async () => {
    if (!joinUrl) return;
    try {
      const supported = await Linking.canOpenURL(joinUrl);
      if (supported) {
        await Linking.openURL(joinUrl);
      } else {
        showDialog({
          variant: "warning",
          title: "Link indisponível",
          message: "Não foi possível abrir o link da videochamada neste aparelho.",
        });
      }
    } catch {
      showDialog({
        variant: "danger",
        title: "Erro",
        message: "Não foi possível abrir a sala da reunião.",
      });
    }
  };

  const handleShareMeeting = async () => {
    const dateStr = startDate.toLocaleDateString("pt-BR");
    const timeStr = endTimeLabel
      ? `${startTimeLabel} – ${endTimeLabel}`
      : startTimeLabel;
    const messageLines = [
      `Oriently — ${event.name}`,
      `Data: ${dateStr} às ${timeStr}`,
      `Local: ${getLocationLabel()}`,
    ];
    if (joinUrl) {
      messageLines.push(`Link: ${joinUrl}`);
    }

    try {
      await Share.share({
        message: messageLines.join("\n"),
      });
    } catch {
      // ignora cancelamento do share sheet
    }
  };

  const toggleChecklistItem = (id: string) => {
    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCancelOrientation = async () => {
    try {
      const invitees =
        event.invitees && event.invitees.length > 0
          ? event.invitees
          : await getEventInvitees(event.uri);

      const isUserEvent = invitees.some(
        (invitee) =>
          invitee.email &&
          invitee.email.toLowerCase() === user?.email?.toLowerCase()
      );

      if (!isUserEvent) {
        showDialog({
          variant: "danger",
          title: "Sem permissão",
          message: "Você não tem permissão para cancelar este evento.",
        });
        return;
      }

      const eventDateFormatted = startDate.toLocaleDateString("pt-BR");
      const eventTimeFormatted = endTimeLabel
        ? `${startTimeLabel} – ${endTimeLabel}`
        : startTimeLabel;

      showDialog({
        variant: "danger",
        title: "Cancelar reunião",
        message: "Tem certeza que deseja cancelar esta orientação?",
        details: {
          title: event.name,
          date: eventDateFormatted,
          time: eventTimeFormatted,
        },
        actions: [
          { label: "Manter", tone: "secondary" },
          {
            label: "Confirmar cancelamento",
            tone: "danger",
            onPress: async () => {
              setCanceling(true);
              try {
                const result = await cancelEvent(event.uri);
                if (result.success) {
                  showDialog({
                    variant: "success",
                    title: "Reunião cancelada",
                    message: "Sua orientação foi cancelada com sucesso.",
                  });
                  navigation.goBack();
                } else if (
                  result.code === "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED"
                ) {
                  const message =
                    result.error ||
                    "Esta é uma reunião compartilhada. Cancele apenas a sua participação pelo link individual.";

                  if (result.cancelUrl) {
                    const cancelUrl = result.cancelUrl;
                    showDialog({
                      variant: "warning",
                      title: "Reunião compartilhada",
                      message,
                      details: {
                        title: event.name,
                        date: eventDateFormatted,
                        time: eventTimeFormatted,
                      },
                      actions: [
                        { label: "Fechar", tone: "secondary" },
                        {
                          label: "Cancelar minha participação",
                          tone: "primary",
                          onPress: async () => {
                            await Linking.openURL(cancelUrl);
                          },
                        },
                      ],
                    });
                  } else {
                    showDialog({
                      variant: "warning",
                      title: "Reunião compartilhada",
                      message,
                    });
                  }
                } else {
                  showDialog({
                    variant: "danger",
                    title: "Erro",
                    message:
                      result.error || "Não foi possível cancelar a reunião.",
                  });
                }
              } catch {
                showDialog({
                  variant: "danger",
                  title: "Erro",
                  message: "Não foi possível cancelar a reunião.",
                });
              } finally {
                setCanceling(false);
              }
            },
          },
        ],
      });
    } catch {
      showDialog({
        variant: "danger",
        title: "Erro",
        message:
          "Não foi possível verificar se você tem permissão para cancelar este evento.",
      });
    }
  };

  return (
    <Container>
      <TopBar topInset={insets.top}>
        <TopBarLeft>
          <IconButton
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Feather name="arrow-left" size={22} color="#0f1b32" />
          </IconButton>

          <TopBarTextCol>
            <TopBarTitle numberOfLines={1}>
              Detalhes da Orientação
            </TopBarTitle>
            <TopBarSubtitle>Sessão com Orientador</TopBarSubtitle>
          </TopBarTextCol>
        </TopBarLeft>

        <IconButton
          onPress={handleShareMeeting}
          accessibilityRole="button"
          accessibilityLabel="Compartilhar detalhes da orientação"
        >
          <Feather name="share-2" size={19} color="#414754" />
        </IconButton>
      </TopBar>

      <ScrollBody
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 16,
        }}
      >
        <Content>
          <JourneyHeader>
            <JourneyPill>
              <Feather name="compass" size={12} color="#005bb1" />
              <JourneyPillText>Jornada do TCC • Orientação</JourneyPillText>
            </JourneyPill>

            <EventHeadline>{event.name}</EventHeadline>

            <StatusRow>
              <StatusPill variant={variant}>
                <StatusDot variant={variant} />
                <StatusPillText variant={variant}>
                  {statusLabel}
                </StatusPillText>
              </StatusPill>
              <CountdownText>{getCountdownLabel()}</CountdownText>
            </StatusRow>
          </JourneyHeader>

          {event.cancel_reason && (
            <CancelReasonBox>
              <Feather name="alert-circle" size={16} color="#93000a" />
              <CancelReasonBoxText>
                Motivo do cancelamento: {event.cancel_reason}
              </CancelReasonBoxText>
            </CancelReasonBox>
          )}

          <SessionCard>
            <SessionTopRow>
              <CalendarBlock>
                <CalendarMonth>{monthLabel}</CalendarMonth>
                <CalendarDay>{dayLabel}</CalendarDay>
                <CalendarYear>{yearLabel}</CalendarYear>
              </CalendarBlock>

              <SessionMetaCol>
                <TimeRow>
                  <Feather name="clock" size={16} color="#005bb1" />
                  <TimeText>
                    {endTimeLabel
                      ? `${startTimeLabel} – ${endTimeLabel}`
                      : startTimeLabel}
                  </TimeText>
                </TimeRow>

                {durationMin && durationMin > 0 && (
                  <DurationText>{durationMin} minutos de sessão</DurationText>
                )}

                <ModalityRow>
                  <Feather
                    name={joinUrl ? "video" : "map-pin"}
                    size={15}
                    color="#005bb1"
                  />
                  <ModalityText>{getLocationLabel()}</ModalityText>
                </ModalityRow>
              </SessionMetaCol>
            </SessionTopRow>

            {displayJoinUrl && (
              <LinkChip
                activeOpacity={0.8}
                onPress={handleShareMeeting}
                accessibilityRole="button"
                accessibilityLabel="Compartilhar ou copiar link da reunião"
              >
                <LinkChipLeft>
                  <Feather name="link" size={15} color="#414754" />
                  <LinkChipText numberOfLines={1}>
                    {displayJoinUrl}
                  </LinkChipText>
                </LinkChipLeft>
                <Feather name="share" size={15} color="#005bb1" />
              </LinkChip>
            )}

            {isUpcoming && (
              <>
                {joinUrl && (
                  <PrimaryCallButton
                    activeOpacity={0.86}
                    onPress={handleOpenJoinUrl}
                    accessibilityRole="button"
                    accessibilityLabel="Entrar na videochamada"
                  >
                    <Feather name="video" size={18} color="#FFFFFF" />
                    <PrimaryCallButtonText>
                      Entrar na videochamada
                    </PrimaryCallButtonText>
                  </PrimaryCallButton>
                )}

                <SecondaryActionPill
                  activeOpacity={0.84}
                  onPress={() => navigation.navigate("MainTabs", { screen: "Schedule" })}
                  accessibilityRole="button"
                  accessibilityLabel="Agendar outra orientação"
                >
                  <Feather name="calendar" size={16} color="#005bb1" />
                  <SecondaryActionPillText>
                    Agendar novo horário
                  </SecondaryActionPillText>
                </SecondaryActionPill>
              </>
            )}
          </SessionCard>

          <SectionHeaderRow>
            <SectionDot color="#6a8dff" />
            <SectionTitle>Pauta do encontro</SectionTitle>
          </SectionHeaderRow>

          <ChecklistCard>
            {agendaItems.map((item) => (
              <ChecklistItem
                key={item.id}
                activeOpacity={0.75}
                onPress={() => toggleChecklistItem(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.checked }}
                accessibilityLabel={item.title}
              >
                <CheckboxBox checked={item.checked}>
                  {item.checked && (
                    <Feather name="check" size={13} color="#FFFFFF" />
                  )}
                </CheckboxBox>

                <ChecklistTextCol>
                  <ChecklistTitle checked={item.checked}>
                    {item.title}
                  </ChecklistTitle>
                  <ChecklistMeta>{item.meta}</ChecklistMeta>
                </ChecklistTextCol>
              </ChecklistItem>
            ))}
          </ChecklistCard>

          <CoachTipCard>
            <CoachTipIconBox>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={19}
                color="#FFFFFF"
              />
            </CoachTipIconBox>
            <ChecklistTextCol>
              <CoachTipTitle>Dica do Oriently</CoachTipTitle>
              <CoachTipBody>
                Lembre-se de testar seu microfone com antecedência e anotar suas
                principais dúvidas pontuais. Encontros focados rendem 2x mais!
              </CoachTipBody>
            </ChecklistTextCol>
          </CoachTipCard>

          {isUpcoming && (
            <BottomActions>
              <RescheduleButton
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("MainTabs", { screen: "Schedule" })
                }
                accessibilityRole="button"
                accessibilityLabel="Reagendar horário"
              >
                <Feather name="calendar" size={16} color="#005bb1" />
                <RescheduleButtonText>Reagendar horário</RescheduleButtonText>
              </RescheduleButton>

              <CancelButton
                activeOpacity={0.8}
                disabled={canceling}
                onPress={handleCancelOrientation}
                accessibilityRole="button"
                accessibilityLabel="Cancelar orientação"
              >
                {canceling ? (
                  <ActivityIndicator size="small" color="#ba1a1a" />
                ) : (
                  <>
                    <Feather name="x-circle" size={16} color="#ba1a1a" />
                    <CancelButtonText>Cancelar orientação</CancelButtonText>
                  </>
                )}
              </CancelButton>
            </BottomActions>
          )}
        </Content>
      </ScrollBody>
    </Container>
  );
}
