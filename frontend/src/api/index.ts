import axios from 'axios';
import { Venue, Gig, Template, Practice, PracticeDay } from '../types';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ token: string; username: string }>('/auth/login', { username, password }).then(r => r.data),
  me: () => api.get<{ username: string }>('/auth/me').then(r => r.data),
};

export const usersApi = {
  getAll: () => api.get<{ _id: string; username: string; createdAt: string }[]>('/users').then(r => r.data),
  create: (username: string, password: string) =>
    api.post('/users', { username, password }).then(r => r.data),
  changePassword: (id: string, password: string) =>
    api.put(`/users/${id}/password`, { password }).then(r => r.data),
  delete: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
};

export const venuesApi = {
  getAll: () => api.get<Venue[]>('/venues').then(r => r.data),
  getById: (id: string) => api.get<Venue>(`/venues/${id}`).then(r => r.data),
  create: (data: Partial<Venue>) => api.post<Venue>('/venues', data).then(r => r.data),
  update: (id: string, data: Partial<Venue>) => api.put<Venue>(`/venues/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/venues/${id}`).then(r => r.data),
};

export const gigsApi = {
  getAll: () => api.get<Gig[]>('/gigs').then(r => r.data),
  getById: (id: string) => api.get<Gig>(`/gigs/${id}`).then(r => r.data),
  create: (data: Partial<Gig>) => api.post<Gig>('/gigs', data).then(r => r.data),
  update: (id: string, data: Partial<Gig>) => api.put<Gig>(`/gigs/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/gigs/${id}`).then(r => r.data),
};

export const emailApi = {
  send: (venueId: string, templateId?: string, subject?: string) =>
    api.post(`/email/send/${venueId}`, { templateId, subject }).then(r => r.data),
  previewUrl: (venueId: string, templateId?: string, lang?: 'da' | 'en') => {
    const params = new URLSearchParams();
    if (templateId) params.set('templateId', templateId);
    if (lang) params.set('lang', lang);
    const qs = params.toString();
    return `/api/email/preview/${venueId}${qs ? `?${qs}` : ''}`;
  },
  previewTemplateUrl: (templateId: string, recipientName = 'Spillestedet') =>
    `/api/public/preview-template?templateId=${templateId}&recipientName=${encodeURIComponent(recipientName)}`,
};

import type { Trivia } from '../types';

export const triviaApi = {
  getAll: () => api.get<Trivia[]>('/trivia').then(r => r.data),
  create: (text: string) => api.post<Trivia>('/trivia', { text }).then(r => r.data),
  update: (id: string, data: { text?: string; active?: boolean }) => api.put<Trivia>(`/trivia/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/trivia/${id}`).then(r => r.data),
};

export const templatesApi = {
  getAll: () => api.get<Template[]>('/templates').then(r => r.data),
  getById: (id: string) => api.get<Template>(`/templates/${id}`).then(r => r.data),
  create: (data: Partial<Template>) => api.post<Template>('/templates', data).then(r => r.data),
  update: (id: string, data: Partial<Template>) => api.put<Template>(`/templates/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/templates/${id}`).then(r => r.data),
};

export const practiceApi = {
  getByMonth: (year: number, month: number) =>
    api.get<Practice[]>('/practice', { params: { year, month } }).then(r => r.data),
  toggle: (date: string) =>
    api.post<{ action: 'added' | 'removed'; entry?: Practice; date?: string }>('/practice/toggle', { date }).then(r => r.data),
  getDaysByMonth: (year: number, month: number) =>
    api.get<PracticeDay[]>('/practice/days', { params: { year, month } }).then(r => r.data),
  scheduleDay: (date: string, notes?: string) =>
    api.post<PracticeDay>('/practice/days', { date, notes }).then(r => r.data),
  removeDay: (id: string) =>
    api.delete(`/practice/days/${id}`).then(r => r.data),
};
