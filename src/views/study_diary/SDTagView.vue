<template>
<div class="container">
    <div class="breadcrumb">
        <router-link to="/study-diary">Nhật Ký T.Gian Học</router-link>
        <router-link :to="'/study-diary/' + tagData.id">{{ tagData.name }}</router-link>
    </div>

    <!-- Tag -->
    <div
    class="header mb-4"
    :style="{
        backgroundColor: tagData.bg_color,
        color: tagData.text_color
    }">
        <div>
            <div
            v-if="learningDiaryData.is_learning == 1">
                <div class="icon" @click="stopLearnPopup.isDisplay = true">
                    <span class="material-icons">stop</span>
                </div>

                <p>Bắt đầu: <b>{{ convertISOTimeToLocalDate(learningDiaryData.start_at) }}</b></p>
                <p>Đang học <b>{{ showStopwatchTime }}</b></p>
            </div>
            <div
            v-else
            class="icon"
            @click="startLearn()" >
                <span class="material-icons">play_arrow</span>
            </div>
        </div>

        <div>
            <div class="d-flex justify-content-center align-items-center">
                <span class="material-icons mr-2">{{ tagData.icon }}</span>
                <h3>{{ tagData.name }}</h3>
            </div>

            <p>Hôm nay: <b>{{ minutesToStr(tagData.time_today) }}</b></p>
            <p>Tuần này: <b>{{ minutesToStr(tagData.time_week) }}</b></p>
            <p>Tháng này: <b>{{ minutesToStr(tagData.time_month) }}</b></p>
            <p>Năm nay: <b>{{ minutesToStr(tagData.time_year) }}</b></p>
            <p>Tổng thời gian học: <b>{{ minutesToStr(tagData.time_total) }}</b></p>
        </div>
    </div>

    <!-- Stop learn popup -->
    <Transition name="fade-in">
        <div class="popup" v-show="stopLearnPopup.isDisplay">
            <div class="popup-bg" @click="stopLearnPopup.isDisplay = false"></div>

            <div class="container container-md">
                <!-- Header -->
                <div>
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="material-icons mr-2">delete_forever</span>
                        <h3>Không học nữa à?</h3>
                    </div>

                    <span class="material-icons btn-close" @click="stopLearnPopup.isDisplay = false">close</span>
                </div>

                <!-- Body -->
                <div>
                    <p>Bạn đã học được gì rồi? Viết xuống đây nhé!</p>
                    <p class="text-secondary">
                        (Cú pháp viết chuẩn
                        <router-link to="/">Markdown</router-link>)
                    </p>

                    <TextArea
                    v-model="stopLearnPopup.log"
                    :rows="20"
                    placeholder="Viết những gì bạn vừa học xuống đây nhé!"
                    ></TextArea>

                    <p>Preview: </p>
                    <div
                    class="quote"
                    v-html="stopLearnPopup.preview"
                    ></div>

                    <button class="btn btn-primary" @click="stopLearn()">
                        <span class="material-icons">save</span>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- History -->
    <div>
        <h3>Nhật Ký Học Tập</h3>

        <ContributionDiary
        :tag="tagData.id"
        v-if="tagData.id != 0"
        :refesh-toogle="refeshToggle" />
    </div>

    <!-- Message -->
    <MessagePopup
    :title="message.title"
    :message="message.message"
    :type="message.type"
    :is-display="message.isDisplay" />
</div>
</template>

<script>
import store from '@/assets/js/store'
import api from '@/assets/js/api'
import MessagePopup from '@/components/MessagePopup.vue'
import TextArea from '@/components/TextArea.vue'
import ContributionDiary from '@/components/study_diary/ContributionDiary.vue'
import { marked } from 'marked'

export default {
    name: 'SDTagView',

    created () {
        this.getTagData()
    },

    components: {
        MessagePopup,
        TextArea,
        ContributionDiary
    },

    data () {
        return {
            data: store.getAll(),

            tagData: {
                id: 0,
                name: '',
                bg_color: 'inherit',
                text_color: 'inherit',
                icon: '',
                time_today: 0,
                time_week: 0,
                time_month: 0,
                time_year: 0,
                time_total: 0
            },

            learningDiaryData: {
                id: 0,
                sdtag: 0,
                user: 0,
                log: '',
                is_learning: 0,
                start_at: '',
                stop_at: ''
            },

            stopLearnPopup: {
                isDisplay: false,
                log: '',
                preview: ''
            },

            message: {
                title: '',
                message: '',
                type: '',
                isDisplay: false
            },

            stopwatch: 0,
            refeshToggle: false
        }
    },

    methods: {
        async getTagData () {
            this.data.isLoading = true

            let result, data;

            try {
                result = await api.get('/study-diary/tag/' + this.$route.params.id)
                data = await result.json()

                if (result.status != 200) {
                    this.$router.push('/study-diary')
                    throw new Error(data.error)
                }
            }
            catch (err) {
                this.$router.push('/study-diary')
                throw err
            }

            this.tagData = data.data

            if (this.data.learningDiary.sdtag == this.tagData.id) {
                this.learningDiaryData = this.data.learningDiary
                this.startStopwatch()
            }

            this.data.isLoading = false
        },

        startLearn () {
            if (this.data.learningDiary) {
                this.showMessage(
                    'Lỗi',
                    'Bạn đang học môn khác rồi!',
                    'warning'
                )

                return
            }

            this.data.isLoading = true

            api.post('/study-diary/diary', {
                sdtag: this.tagData.id
            }).then(res => {
                this.data.isLoading = false

                res.json().then(data => {
                    if (res.status === 200) {
                        this.learningDiaryData = data.data
                        this.data.learningDiary = this.learningDiaryData

                        sessionStorage.removeItem('tags')

                        this.startStopwatch()
                    }
                    else {
                        console.log(data.error)
                        this.showMessage(
                            'Lỗi',
                            'Đã có lỗi xảy ra, vui lòng thử lại sau',
                            'error'
                        )
                    }
                })
            }).catch(err => {
                console.log(err)
                this.data.isLoading = false
                this.showMessage(
                    'Lỗi',
                    'Không thể kết nối đến máy chủ, vui lòng thử lại sau',
                    'error'
                )
            })
        },

        async stopLearn () {
            if (this.stopLearnPopup.log.length === 0) {
                this.showMessage(
                    'Lỗi',
                    'Bạn chưa viết gì',
                    'warning'
                )
                return
            }

            this.data.isLoading = true

            let result = await api.put('/study-diary/diary', {
                id: this.learningDiaryData.id,
                log: this.stopLearnPopup.log
            })

            let data = await result.json()

            if (result.status !== 200) {
                this.showMessage(
                    'Lỗi',
                    'Đã có lỗi xảy ra, vui lòng thử lại sau',
                    'error'
                )
                
                throw new Error(data.error)
            }

            this.learningDiaryData.is_learning = 0
            this.data.learningDiary = false
            this.stopLearnPopup.isDisplay = false
            this.stopLearnPopup.log = ''

            this.tagData = data.data
            sessionStorage.removeItem('tags')
            this.refeshToggle = !this.refeshToggle

            this.showMessage(
                'Thành công',
                'Lưu thành công',
                'success'
            )

            this.data.isLoading = false
        },

        minutesToStr (minutes) {
            let hours = (minutes / 60).toFixed(2)

            return `${hours} giờ (${minutes} phút)`
        },

        showMessage (title, message, type) {
            this.message.title = title
            this.message.message = message
            this.message.type = type
            this.message.isDisplay = !this.message.isDisplay
        },

        convertISOTimeToLocalDate (isoTime) {
            return new Date(isoTime).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            })
        },

        startStopwatch () {
            let startTime = this.learningDiaryData.start_at
            let nowTime = new Date().toISOString()

            let diff = new Date(nowTime) - new Date(startTime)
            let seconds = Math.round(diff / 1000)

            this.stopwatch = seconds

            this.loopStopwatch()
        },

        loopStopwatch () {
            if (this.learningDiaryData.is_learning) {
                setTimeout(() => {
                    this.stopwatch++
                    this.loopStopwatch()
                }, 1000)
            }
        }
    },

    watch: {
        'stopLearnPopup.log' (val) {
            this.stopLearnPopup.preview = marked.parse(val)
        }
    },

    computed: {
        showStopwatchTime () {
            let minutes = Math.floor(this.stopwatch / 60)
            let seconds = this.stopwatch % 60
            let hours = (minutes / 60).toFixed(2)

            return `${minutes} phút ${seconds} giây (${hours} giờ)`
        }
    }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    border-radius: .5rem;
    box-sizing: border-box;
    padding: 2rem 1rem;
}

.header > div {
    text-align: center;
}

.header .icon {
    display: inline-block;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color .5s;
    box-sizing: border-box;
}

.header .icon:hover {
    background-color: #f5f5f5;
}

.header .icon .material-icons {
    font-size: 7rem;
}
</style>