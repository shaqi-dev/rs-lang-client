export interface UserSettingsResponse {
  id: string;
  optional?: {
    lastVisit?: number;
  };
}

export interface UserSettingsBody {
  optional?: {
    lastVisit?: number;
  };
}
