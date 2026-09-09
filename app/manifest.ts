import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KisanDirect | Direct Farmgate Agro-Marketplace',
    short_name: 'KisanDirect',
    description: 'Maharashtra Direct Agricultural Marketplace connecting verified farmers directly with consumers, restaurants & retail marts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#059669',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'business', 'food'],
  };
}
