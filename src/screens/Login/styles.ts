import styled, { DefaultTheme } from "styled-components/native";

type ThemedProps = { theme: DefaultTheme };

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9ff;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const MainColumn = styled.View`
  width: 100%;
  max-width: 400px;
  align-self: center;
`;

export const BrandHeader = styled.View`
  align-items: center;
  margin-bottom: 18px;
`;

export const BrandBadgeBox = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e4ebff;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  shadow-color: #258bff;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.14;
  shadow-radius: 16px;
  elevation: 4;
`;

export const BrandNeedleGroup = styled.View`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
`;

export const BrandNeedleNorth = styled.View`
  width: 0px;
  height: 0px;
  border-left-width: 5px;
  border-right-width: 5px;
  border-bottom-width: 12px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: #005bb1;
`;

export const BrandNeedleSouth = styled.View`
  width: 0px;
  height: 0px;
  border-left-width: 5px;
  border-right-width: 5px;
  border-top-width: 12px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #7c72e8;
`;

export const BrandNeedlePivot = styled.View`
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #ffffff;
  border-width: 1.5px;
  border-color: #0f1b32;
`;

export const BrandTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const BrandTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 24px;
  color: #0f1b32;
  letter-spacing: -0.5px;
`;

export const ProPill = styled.View`
  background-color: #d6e3ff;
  padding: 2px 7px;
  border-radius: 999px;
`;

export const ProPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 9px;
  color: #001b3d;
  letter-spacing: 0.8px;
`;

export const BrandEyebrow = styled.Text`
  margin-top: 2px;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: #005bb1;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const HeroCard = styled.View<{ isShortScreen?: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 190 : 224}px;
  border-radius: 20px;
  background-color: #f1f3ff;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  shadow-color: #0f1b32;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.06;
  shadow-radius: 20px;
  elevation: 3;
`;

export const GlowTopRight = styled.View`
  position: absolute;
  top: -36px;
  right: -28px;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: rgba(37, 139, 255, 0.14);
`;

export const GlowBottomLeft = styled.View`
  position: absolute;
  bottom: -40px;
  left: -28px;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: rgba(124, 114, 232, 0.14);
`;

type TrailDotProps = {
  leftPct: number;
  topPct: number;
  size?: number;
  color?: string;
};

export const TrailDot = styled.View<TrailDotProps>`
  position: absolute;
  left: ${({ leftPct }: TrailDotProps) => leftPct}%;
  top: ${({ topPct }: TrailDotProps) => topPct}%;
  width: ${({ size }: TrailDotProps) => size ?? 5}px;
  height: ${({ size }: TrailDotProps) => size ?? 5}px;
  border-radius: ${({ size }: TrailDotProps) => (size ?? 5) / 2}px;
  background-color: ${({ color }: TrailDotProps) => color ?? "#94b8ff"};
`;

type MilestoneNodeProps = {
  leftPct: number;
  topPct: number;
  bgColor?: string;
};

export const MilestoneNode = styled.View<MilestoneNodeProps>`
  position: absolute;
  left: ${({ leftPct }: MilestoneNodeProps) => leftPct}%;
  top: ${({ topPct }: MilestoneNodeProps) => topPct}%;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ bgColor }: MilestoneNodeProps) =>
    bgColor ?? "#258bff"};
  border-width: 2.5px;
  border-color: #ffffff;
  shadow-color: #0f1b32;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.14;
  shadow-radius: 4px;
  elevation: 2;
`;

export const CompassOuterRing = styled.View<{ isShortScreen?: boolean }>`
  width: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 92 : 104}px;
  height: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 92 : 104}px;
  border-radius: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 46 : 52}px;
  background-color: rgba(255, 255, 255, 0.85);
  align-items: center;
  justify-content: center;
  shadow-color: #1e355e;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.12;
  shadow-radius: 18px;
  elevation: 5;
`;

export const CompassInnerDisk = styled.View<{ isShortScreen?: boolean }>`
  width: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 72 : 82}px;
  height: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 72 : 82}px;
  border-radius: ${({ isShortScreen }: { isShortScreen?: boolean }) =>
    isShortScreen ? 36 : 41}px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e2e8f0;
  align-items: center;
  justify-content: center;
`;

type CardinalDotProps = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export const CardinalDot = styled.View<CardinalDotProps>`
  position: absolute;
  ${({ top }: CardinalDotProps) => (top !== undefined ? `top: ${top}px;` : "")}
  ${({ bottom }: CardinalDotProps) =>
    bottom !== undefined ? `bottom: ${bottom}px;` : ""}
  ${({ left }: CardinalDotProps) =>
    left !== undefined ? `left: ${left}px;` : ""}
  ${({ right }: CardinalDotProps) =>
    right !== undefined ? `right: ${right}px;` : ""}
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #cbd5e1;
`;

export const HeroNeedleGroup = styled.View`
  align-items: center;
  justify-content: center;
  transform: rotate(38deg);
`;

export const HeroNeedleNorth = styled.View`
  width: 0px;
  height: 0px;
  border-left-width: 7px;
  border-right-width: 7px;
  border-bottom-width: 22px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: #005bb1;
`;

export const HeroNeedleSouth = styled.View`
  width: 0px;
  height: 0px;
  border-left-width: 7px;
  border-right-width: 7px;
  border-top-width: 22px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #7c72e8;
`;

export const HeroNeedleCenter = styled.View`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #0f1b32;
  border-width: 2px;
  border-color: #ffffff;
`;

export const FloatingStatusCardTop = styled.View`
  position: absolute;
  top: 14px;
  left: 14px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.96);
  padding: 7px 10px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #ffffff;
  shadow-color: #0f1b32;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  elevation: 3;
`;

export const FloatingCardIconBlue = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background-color: #dce1ff;
  align-items: center;
  justify-content: center;
`;

export const FloatingStatusCardBottom = styled.View`
  position: absolute;
  bottom: 14px;
  right: 14px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.96);
  padding: 7px 10px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #ffffff;
  shadow-color: #0f1b32;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  elevation: 3;
`;

export const FloatingCardIconEmerald = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: #d1fae5;
  align-items: center;
  justify-content: center;
`;

export const FloatingCardTextGroup = styled.View`
  flex-direction: column;
`;

export const FloatingCardMeta = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 9px;
  color: #64748b;
  letter-spacing: 0.3px;
`;

export const FloatingCardTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 11px;
  color: #0f1b32;
`;

export const ValuePropSection = styled.View`
  align-items: center;
  margin-bottom: 18px;
`;

export const JourneyPill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #dce1ff;
  padding: 5px 12px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

export const JourneyPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10px;
  color: #023cad;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const Title = styled.Text<{ isCompact?: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: ${({ isCompact }: { isCompact?: boolean }) =>
    isCompact ? 23 : 26}px;
  line-height: ${({ isCompact }: { isCompact?: boolean }) =>
    isCompact ? 30 : 33}px;
  color: #0f1b32;
  text-align: center;
  letter-spacing: -0.6px;
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13.5px;
  line-height: 20px;
  color: #444653;
  text-align: center;
  padding-horizontal: 4px;
`;

export const ProgressDotsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
`;

export const ProgressDotActive = styled.View`
  width: 28px;
  height: 6px;
  border-radius: 3px;
  background-color: #005bb1;
`;

export const ProgressDotMuted = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #d8e2ff;
`;

export const ActionsStack = styled.View`
  width: 100%;
  gap: 10px;
  margin-bottom: 16px;
`;

export const GoogleButton = styled.TouchableOpacity`
  width: 100%;
  height: 54px;
  border-radius: 16px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e2e8f0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 18px;
  shadow-color: #0f1b32;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.06;
  shadow-radius: 12px;
  elevation: 2;
`;

export const GoogleButtonLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

export const GoogleButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 15px;
  color: #0f1b32;
`;

export const DemoButton = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  border-radius: 16px;
  background-color: #dce1ff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const DemoButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 14px;
  color: #023cad;
`;

export const FooterText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 11.5px;
  line-height: 17px;
  color: #6d7c93;
  text-align: center;
  padding-horizontal: 12px;
`;

export const FooterLinkText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  color: #005bb1;
`;
