import { create } from 'zustand';
import api from '@/lib/api';

export interface BrandingConfig {
  tenantId: string | null;
  companyName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  customCss: string | null;
}

interface BrandingState {
  branding: BrandingConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchBranding: () => Promise<BrandingConfig>;
}

export const useBrandingStore = create<BrandingState>((set) => ({
  branding: null,
  isLoading: false,
  error: null,
  fetchBranding: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/v2/tenants/branding/resolve');
      // Unwrapped response structure handles both direct data and axio response
      const data: BrandingConfig = response.data || response;
      
      set({ branding: data, isLoading: false });
      
      // Inject CSS variables dynamically into document root
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--primary-theme', data.primaryColor || '#0f766e');
        root.style.setProperty('--secondary-theme', data.secondaryColor || '#0d9488');
        
        // Dynamically inject custom CSS blocks safely if configured by admin
        if (data.customCss) {
          let styleEl = document.getElementById('medflow-custom-branding-css') as HTMLStyleElement;
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'medflow-custom-branding-css';
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = data.customCss;
        }

        // Dynamically update favicon if provided
        if (data.faviconUrl) {
          let linkEl = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (!linkEl) {
            linkEl = document.createElement('link');
            linkEl.rel = 'shortcut icon';
            document.head.appendChild(linkEl);
          }
          linkEl.href = data.faviconUrl;
        }
      }
      
      return data;
    } catch (err: any) {
      console.error('Failed to resolve dynamic branding context:', err);
      const fallback: BrandingConfig = {
        tenantId: null,
        companyName: 'MedFlow',
        logoUrl: null,
        faviconUrl: null,
        primaryColor: '#0f766e',
        secondaryColor: '#0d9488',
        customCss: '',
      };
      set({ branding: fallback, isLoading: false, error: err.message });
      return fallback;
    }
  },
}));
