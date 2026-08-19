// Kept as a standalone string union (not imported from apps/mobile/src) so this
// module stays portable on its own — the values intentionally match
// apps/mobile/src/types/screenBlocker.ts's ShieldAuthorizationStatus enum
// one-for-one, so callers can use either interchangeably.
export type ShieldAuthorizationStatusValue = 'approved' | 'denied' | 'notDetermined' | 'unavailable';

export interface SelectionChangeEvent {
  token: string;
  applicationCount: number;
  categoryCount: number;
}

export interface ExpoScreenShieldPickerViewProps {
  onSelectionChange?: (event: { nativeEvent: SelectionChangeEvent }) => void;
  /** Fires when Apple's native picker sheet closes — on Cancel and on Done alike,
   * since that's the only signal the SwiftUI modifier exposes. */
  onDismiss?: () => void;
  style?: object;
}

export interface ExpoScreenShieldSummaryViewProps {
  token: string | null;
  style?: object;
}
