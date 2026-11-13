import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lumenza',
    short_name: 'Lumenza',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: '#fbfaf7',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
