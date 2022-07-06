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
                <div class="icon" @click="showStopLearnPopup()">
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

            <table>
                <tr>
                    <td>Hôm nay:</td>
                    <th>{{ minutesToStr(tagData.time_today) }}</th>
                </tr>
                <tr>
                    <td>Tuần:</td>
                    <th>{{ minutesToStr(tagData.time_week) }}</th>
                </tr>
                <tr>
                    <td>Tháng:</td>
                    <th>{{ minutesToStr(tagData.time_month) }}</th>
                </tr>
                <tr>
                    <td>Năm:</td>
                    <th>{{ minutesToStr(tagData.time_year) }}</th>
                </tr>
                <tr>
                    <td>Tổng:</td>
                    <th>{{ minutesToStr(tagData.time_total) }}</th>
                </tr>
            </table>
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
        :userID="tagData.user"
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
import { mapState, mapMutations, mapActions } from 'vuex' 
import { marked } from 'marked'
import api from '@/store/api'
import MessagePopup from '@/components/MessagePopup.vue'
import TextArea from '@/components/TextArea.vue'
import ContributionDiary from '@/components/study_diary/ContributionDiary.vue'

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
        ...mapMutations(['setTitle', 'setIsLoading', 'setLearningDiary']),
        ...mapActions(['getLearningDiary']),

        async getTagData () {
            this.setIsLoading(true)

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

            // Change title
            this.setTitle(this.tagData.name + ' - Study Diary - MTLKMS')
   
            if (this.isAuth) {
                if (this.learningDiary.sdtag == this.tagData.id) {
                    this.learningDiaryData = this.learningDiary
                    this.startStopwatch()
                }
            }
            else {
                await this.getLearningDiaryData()
            }

            this.setIsLoading(false)
        },

        async getLearningDiaryData () {
            try {
                let data = await this.getLearningDiary(this.tagData.user)

                if (!data) return
                
                if (this.tagData.id == data.sdtag) {
                    this.learningDiaryData = data
                    this.startStopwatch()
                }
            }
            catch (err) {
                console.log(err)
            }
        },

        startLearn () {
            if (!this.isAuth) return

            if (this.learningDiary) {
                this.showMessage(
                    'Lỗi',
                    'Bạn đang học môn khác rồi!',
                    'warning'
                )

                return
            }

            this.setIsLoading(true)

            api.post('/study-diary/diary', {
                sdtag: this.tagData.id
            }).then(res => {
                this.setIsLoading(false)

                res.json().then(data => {
                    if (res.status === 200) {
                        let learningDiary = data.data
                        learningDiary.name = this.tagData.name
                        this.learningDiaryData = learningDiary
                        this.setLearningDiary(learningDiary)

                        sessionStorage.clear()

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
                this.setIsLoading(false)

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

            this.setIsLoading(true)

            let result = await api.put('/study-diary/diary', {
                id: this.learningDiaryData.id,
                log: this.stopLearnPopup.log
            })

            let data = await result.json()

            if (result.status !== 200) {
                this.setIsLoading(false)

                this.showMessage(
                    'Lỗi',
                    'Đã có lỗi xảy ra, vui lòng thử lại sau',
                    'error'
                )
                
                throw new Error(data.error)
            }

            this.setLearningDiary(false)

            this.learningDiaryData.is_learning = 0
            this.stopLearnPopup.isDisplay = false
            this.stopLearnPopup.log = ''

            this.tagData = data.data
            sessionStorage.clear()
            this.refeshToggle = !this.refeshToggle

            this.showMessage(
                'Thành công',
                'Lưu thành công',
                'success'
            )

            this.setIsLoading(false)
        },

        showStopLearnPopup () {
            if (this.isAuth) this.stopLearnPopup.isDisplay = true
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
        ...mapState(['learningDiary', 'user']),

        showStopwatchTime () {
            let minutes = Math.floor(this.stopwatch / 60)
            let seconds = this.stopwatch % 60
            let hours = (minutes / 60).toFixed(2)

            return `${minutes} phút ${seconds} giây (${hours} giờ)`
        },

        isAuth () {
            return this.tagData.user == this.user.id
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
    margin: auto 2rem;
}

.header .icon:hover {
    background-color: #f5f5f5;
}

.header .icon .material-icons {
    font-size: 10rem;
}

table {
    width: 100%;
}

table td {
    text-align: right;
    padding: .5rem;
}
</style>