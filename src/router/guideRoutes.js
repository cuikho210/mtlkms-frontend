import guideView from '@/views/guide/guideView'
import markdownGuideView from '@/views/guide/markdownGuideView'

export default [
    {
        path: '/guide',
        name: 'guide',
        component: guideView,
        meta: {
            title: 'Hướng Dẫn - MTLKMS'
        }
    },

    {
        path: '/guide/markdown',
        name: 'guide-markdown',
        component: markdownGuideView,
        meta: {
            title: 'Cú Pháp Markdown (MD) - MTLKMS'
        }
    }
]