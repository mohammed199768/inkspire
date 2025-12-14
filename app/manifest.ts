import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Inkspire Studio',
        short_name: 'Inkspire',
        description: 'We turn raw ideas into cinematic digital experiences',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#6b4092',
        icons: [
            {
                src: '/logos/Inkspire logos/logo.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    }
}
