export interface AppUser {
  readonly uid: string;
  readonly displayName: string;
  readonly email: string;
  readonly photoURL: string | null;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;
  readonly lastLoginAt: Date | null;
}