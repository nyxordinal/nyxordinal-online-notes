export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface APIResponse<T> {
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface GeneralResponse {
  version: string;
  servertime: number;
}

export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NoteUpdateRequest {
  note_id: string;
  content: string;
}
