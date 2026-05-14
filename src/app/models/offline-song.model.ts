export interface OfflineSong {
  readonly songId: string;
  readonly savedAt: Date | null;
  readonly lastSyncedAt: Date | null;
}