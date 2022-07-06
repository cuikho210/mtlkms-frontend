import SDListView from '@/views/study_diary/SDListView.vue'
import SDTagView from '@/views/study_diary/SDTagView.vue'

export default [
    {
        path: '/study-diary',
        name: 'study-diary',
        component: SDListView,
        meta: {
            title: 'Nhật Ký Thời Gian Học - MTLKMS'
        }
    },

    {
        path: '/study-diary/:id',
        name: 'study-diary-tag',
        component: SDTagView,
        meta: {
            title: 'Nhật Ký Thời Gian Học - MTLKMS'
        }
    }
]