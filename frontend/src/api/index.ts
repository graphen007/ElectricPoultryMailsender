import axios from 'axios';
import { Venue, Gig, Template } from '../types';

const api = axios.create({ baseURL: '/api' });

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
    `/api/email/preview-template?templateId=${templateId}&recipientName=${encodeURIComponent(recipientName)}`,
};

export const templatesApi = {
  getAll: () => api.get<Template[]>('/templates').then(r => r.data),
  getById: (id: string) => api.get<Template>(`/templates/${id}`).then(r => r.data),
  create: (data: Partial<Template>) => api.post<Template>('/templates', data).then(r => r.data),
  update: (id: string, data: Partial<Template>) => api.put<Template>(`/templates/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/templates/${id}`).then(r => r.data),
};
