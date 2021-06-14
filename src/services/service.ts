import { API } from './api';
import { APIResponse, GeneralResponse, NoteResponse, NoteUpdateRequest, ServiceResponse } from './interface';

export const generalIndex = async (): Promise<ServiceResponse> => {
  try {
    const r: APIResponse<GeneralResponse> = await API.get('/');

    // Unexpected network error
    if (!r.code) {
      throw new Error('Network error');
    }

    if (r.code != 200) return { success: false, message: r.error };
    return { success: true, message: r.message, data: r.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getNote = async (noteTitle: string): Promise<ServiceResponse<NoteResponse>> => {
  try {
    if (!noteTitle) return { success: false, message: 'No note id provided' };
    const r: APIResponse<NoteResponse> = await API.get(`/${noteTitle}`);

    // Unexpected network error
    if (!r.code) {
      throw new Error('Network error');
    }

    if (r.code != 200) return { success: false, message: r.error };
    return { success: true, message: r.message, data: r.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateNote = async (noteData: NoteUpdateRequest): Promise<ServiceResponse<NoteResponse>> => {
  try {
    // note_id: noteData.note_id,
    const r: APIResponse<NoteResponse> = await API.post('/update', {
      note_id: noteData.note_id,
      content: noteData.content,
    });

    // Unexpected network error
    if (!r.code) {
      throw new Error('Network error');
    }

    if (r.code != 200) return { success: false, message: r.error };
    return { success: true, message: r.message, data: r.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
