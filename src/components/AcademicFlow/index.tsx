import React from "react";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import {
  BrandWrapper,
  BrandCompassBox,
  BrandTextGroup,
  BrandWordmark,
  BrandJourneySignature,
  SignatureDotStart,
  SignatureSegment,
  SignatureDotEnd,
  BadgePill,
  BadgeLabel,
  CheckpointTrack,
  CheckpointDotOuter,
  CheckpointDotInner,
  CheckpointLine,
  DateBlock,
  DateBlockDay,
  DateBlockMonth,
} from "./styles";

interface BrandMarkProps {
  showJourneySignature?: boolean;
}

export function BrandMark({ showJourneySignature = true }: BrandMarkProps) {
  const theme = useTheme();

  return (
    <BrandWrapper>
      <BrandCompassBox>
        <Feather name="compass" size={16} color={theme.colors.primary} />
      </BrandCompassBox>
      <BrandTextGroup>
        <BrandWordmark>Oriently</BrandWordmark>
        {showJourneySignature && (
          <BrandJourneySignature accessible={false}>
            <SignatureDotStart />
            <SignatureSegment />
            <SignatureDotEnd />
          </BrandJourneySignature>
        )}
      </BrandTextGroup>
    </BrandWrapper>
  );
}

interface AcademicBadgeProps {
  label: string;
  onDark?: boolean;
  iconName?: keyof typeof Feather.glyphMap;
}

export function AcademicBadge({
  label,
  onDark = false,
  iconName = "compass",
}: AcademicBadgeProps) {
  const theme = useTheme();

  return (
    <BadgePill onDark={onDark}>
      <Feather
        name={iconName}
        size={11}
        color={onDark ? "#FFFFFF" : theme.colors.editorial_navy}
      />
      <BadgeLabel onDark={onDark}>{label}</BadgeLabel>
    </BadgePill>
  );
}

interface JourneyCheckpointProps {
  waiting?: boolean;
}

export function JourneyCheckpoint({ waiting = false }: JourneyCheckpointProps) {
  return (
    <CheckpointTrack accessible={false}>
      <CheckpointDotOuter waiting={waiting}>
        <CheckpointDotInner waiting={waiting} />
      </CheckpointDotOuter>
      <CheckpointLine waiting={waiting} />
    </CheckpointTrack>
  );
}

interface EditorialDateBlockProps {
  day: string;
  month: string;
}

export function EditorialDateBlock({ day, month }: EditorialDateBlockProps) {
  return (
    <DateBlock>
      <DateBlockDay>{day}</DateBlockDay>
      <DateBlockMonth>{month}</DateBlockMonth>
    </DateBlock>
  );
}
