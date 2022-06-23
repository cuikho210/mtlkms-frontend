<template>
<div class="container container-md">
    <div>
        <h3>Thông Con Báo</h3>

        <div v-if="learningDiary" class="notifi notifi-danger">
            Bạn đang học môn
            <router-link
            :to="'/study-diary/' + learningDiary.sdtag">
                {{ learningDiary.name }}
            </router-link>
        </div>

        <div class="notifi notifi-success">
            Thống kê ngày sẽ được tính vào lúc <b>23:59:50 mỗi ngày</b>!
        </div>

        <div class="notifi notifi-success">
            Thống kê tuần sẽ được tính vào lúc <b>23:59:50 mỗi thứ 7</b>!
        </div>

        <div class="notifi notifi-success">
            Ghi chú trong MTLKMS sử dụng cú pháp <b>Markdown</b> (MD)
        </div>
    </div>
    <br>

    <div>
        <h3>Hoạt động mới</h3>
        <br>

        <div
        v-for="(diary, index) in diaries"
        :key="index">
            <div class="d-flex align-items-center">
                <img
                :src="getAvatarURL(diary.username)"
                :alt="diary.user + ' avatar'"
                class="avatar" />

                <div class="ml-2">
                    <router-link :to="'/users/' + diary.username">
                        {{ diary.user }}
                    </router-link>

                    vừa học
                    <b>{{ caculateTime(diary.start_at, diary.stop_at) }}</b>
                    <br>

                    trong môn
                    <router-link :to="'/study-diary/' + diary.sdtag">
                        {{ diary.name }}
                    </router-link>
                </div>
            </div>
            
            <p>
                Bắt đầu:
                <b>{{ new Date(diary.start_at).toLocaleString('vi-VN') }}</b>
                <br>
                Kết thúc: 
                <b>{{ new Date(diary.stop_at).toLocaleString('vi-VN') }}</b>
            </p>
            
            <p class="quote" v-html="parseMarkdown(diary.log)"></p>

            <br><hr><br>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import api from '@/store/api'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import 'highlight.js/styles/github.css'

marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-'
})

export default {
    name: 'HomeView',

    data () {
        return {
            diaries: []
        }
    },

    created () {
        if (!this.loadSessionData()) {
            this.fetchDiaries()
        }
    },

    computed: {
        ...mapState(['learningDiary'])
    },

    methods: {
        ...mapMutations(['setIsLoading']),

        async fetchDiaries () {
            try {
                this.setIsLoading(true)

                let result = await api.get('/study-diary/diary/all')
                let data = await result.json()

                this.setIsLoading(false)

                if (result.status != 200) throw new Error(data.error)

                this.diaries = data.data
                this.saveSessionData()
            }
            catch (err) {
                this.setIsLoading(false)
                throw err
            }
        },

        caculateTime (start, end) {
            let startTime = new Date(start)
            let stopTime = new Date(end)
            let timeDiff = stopTime.getTime() - startTime.getTime()
            let minutes = Math.round(timeDiff / 60000)
            let hours = (minutes / 60).toFixed(2)

            return `${hours} giờ (${minutes} phút)`
        },

        parseMarkdown (text) {
            let markedText = marked.parse(text)
            let cleanText = DOMPurify.sanitize(markedText, {FORBID_TAGS: ['style'], FORBID_ATTR: ['style']})
            return cleanText
        },

        saveSessionData () {
            sessionStorage.setItem(
                'homeviewDiaries',
                JSON.stringify(this.diaries)
            )
        },

        loadSessionData () {
            let sessionData = sessionStorage.getItem('homeviewDiaries')
            if (!sessionData) return false

            let data = JSON.parse(sessionData)

            this.diaries = data

            return true
        },

        getAvatarURL (username) {
            return api.getAvatarURL(username)
        }
    }
}
</script>