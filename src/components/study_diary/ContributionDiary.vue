<template>
<div>
    <div class="text-center">
        <div class="date">
            <p class="mr-2">Tháng {{ month }}</p>
            <p>Năm {{ year }}</p>
        </div>

        <p v-if="this.timeMonth > 0">
            Bạn đã học
            <b>
                {{ (this.timeMonth / 60).toFixed(2) }} giờ
                ({{ this.timeMonth }} phút)
            </b>
            trong tháng này
        </p>
        <p v-else>
            Chưa có dữ liệu thống kê cho tháng này
        </p>

        <input type="month" v-model="date" class="mb-4" />
            
        <div class="color-help">
            <span
            v-for="(color, index) in dayColors"
            :key="index"
            :style="{ backgroundColor: color }"
            ></span>
        </div>
    </div>

    <div style="max-width: 100%; overflow-x: scroll">
        <table>
            <tr>
                <th title="Tổng thời gian học của tuần">Week</th>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
            </tr>
            <tr v-for="(row, i) in diaries.data" :key="i">
                <td>
                    <p v-if="diaries.timeWeek[i] != ''">
                        {{ diaries.timeWeek[i] }}'
                        <br>
                        ({{ (diaries.timeWeek[i] / 60).toFixed(1) }}h)
                        <br><br><br>
                    </p>
                </td>

                <td v-for="(col, j) in row" :key="j">
                    <p
                    :title="'Ngày ' + col.day"
                    v-if="col.day != ''"
                    @click="setShowDay(i, j, col.day)"
                    :style="{
                        backgroundColor: dayBackground(col.diary.length),
                        outline: col.isActive ? '1px solid #000' : 'none',
                        boxShadow: col.isToday ? '3px 3px 1px #ff907f' : 'none',
                        color: col.diary.length > 8 ? '#fff' : '#000'
                    }">
                        {{ col.day }}
                    </p>

                    <div
                    v-if="typeof col.time == 'number'"
                    class="text-secondary mt-1">
                        {{ col.time }}'
                        <br>
                        ({{ (col.time / 60).toFixed(1) }}h)
                        <hr>
                    </div>
                    <div v-else>
                        <br><br><br>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div style="margin-bottom: 7rem">
        <h2 class="mb-4">{{ showDay.title }}</h2>
        <hr>

        <div
        v-if="showDay.diary.length == 0"
        style="margin-bottom: 40vh">
            Bạn không học gì vào ngày này
        </div>
        <div
        v-else
        v-for="(diary, index) in showDay.diary"
        :key="index" >
            <div class="ml-3">
                <p v-if="tag == 0">
                    Đã học:
                    <b>
                        {{ caculateTime(diary.start_at, diary.stop_at) }}
                        <router-link :to="'/study-diary/' + diary.sdtag">
                            trong môn {{ diary.name }}
                        </router-link>
                    </b>
                </p>
                <p v-else>
                    Đã học:
                    <b>
                        {{ caculateTime(diary.start_at, diary.stop_at) }}
                    </b>
                </p>

                <p>Bắt đầu: <b>{{ new Date(diary.start_at).toLocaleString('vi-VN') }}</b></p>
                <p>Kết thúc: <b>{{ new Date(diary.stop_at).toLocaleString('vi-VN') }}</b></p>
                <p class="quote" v-html="parseMarkdown(diary.log)"></p>
            </div>
            <br>
            <hr>
            <br>
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
import 'highlight.js/styles/github.css';

marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-'
})

export default {
    name: 'ContributionDiary',

    props: {
        // User id
        userID: {
            type: Number,
            default: 0
        },

        // Tag id
        tag: {
            type: Number,
            default: 0
        },

        refeshToogle: {
            type: Boolean,
            default: false
        }
    },

    created () {
        this.getDiaries()
    },

    data () {
        return {
            diaries: [],
            showDay: {
                title: 'Hôm nay',
                day: 0,
                diary: []
            },
            month: this.$route.query.month || new Date().getMonth() + 1,
            year: this.$route.query.year || new Date().getFullYear(),
            date: '',
            timeMonth: 0,

            dayColors: [
                '#ffffff',
                '#ccffe9',
                '#99ffd4',
                '#65ffbf',
                '#32ffa9',
                '#00ff94',
                '#00e585',
                '#00cc76',
                '#00b268',
                '#009959',
                '#007f4a',
                '#00663b',
                '#004c2c',
                '#00331d',
                '#00190e',
                '#000000',
            ]
        }
    },

    computed: {
        ...mapState(['user'])
    },

    methods: {
        ...mapMutations(['setIsLoading']),

        async getDiaries () {
            let url = '/study-diary/diary/'
            let userID = this.userID || this.user.id

            if (this.tag != 0) {
                url += `${userID}/${this.year}/${this.month}/${this.tag}`
            }
            else {
                url += `${userID}/${this.year}/${this.month}`
            }

            if (this.loadSessionData(url)) {
                return
            }
            else {
                this.setIsLoading(true)

                let result = await api.get(url)
                let data = await result.json()

                this.setIsLoading(false)

                if (result.status != 200) {
                    throw new Error(data.error)
                }

                this.showDay.diary = []
                this.putDiary(data.data.diaries, data.data.times)

                this.saveSessionData(url, data.data)
            }
        },

        putDiary (diaries, times) {
            let cols = [
                [], // Sun
                [], // Mon
                [], // Tue
                [], // Wed
                [], // Thu
                [], // Fri
                [] // Sat
            ]

            let rows = {
                timeWeek: [
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                ],
                data: [
                    [[],[0],[],[],[],[],[]],
                    [[],[],[],[],[],[],[]],
                    [[],[],[],[],[],[],[]],
                    [[],[],[],[],[],[],[]],
                    [[],[],[],[],[],[],[]],
                    cols
                ]
            }

            let date = diaries.length > 0 ? new Date(diaries[0].stop_at) : new Date(this.year, this.month - 1, 1)
            let startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
            let endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
            let count = 1
            
            // Put day number to table
            for (let i = 0; i < rows.data.length; i++) {
                for (let j = 0; j < rows.data[i].length; j++) {
                    let day = count - startDay

                    if (day > 0 && day <= endDay) {
                        let isToday = false;

                        if (this.month == new Date().getMonth() + 1 && this.year == new Date().getFullYear()) {
                            if (new Date().getDate() == day) {
                                isToday = true
                            }
                        }

                        rows.data[i][j] = {
                            day: day,
                            isActive: false,
                            time: null,
                            diary: [],
                            isToday: isToday
                        }
                    }
                    else {
                        rows.data[i][j] = {
                            day: '',
                            diary: []
                        }
                    }

                    count++
                }
            }

            // For setShowDay
            let showDayRow = 0
            let showDayCol = 0
            let showDayDay = new Date().getDate()

            if (diaries) {
                // Put diary to table
                diaries.forEach(diary => {
                    let date = new Date(diary.stop_at)
                    let day = date.getDate()
                    let weekday = date.getDay()

                    let startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

                    let row = Math.ceil((day + startDay) / 7) - 1

                    rows.data[row][weekday].diary.push(diary)

                    if (date.toDateString() == new Date().toDateString()) {
                        showDayRow = row
                        showDayCol = weekday
                        showDayDay = day
                    }
                })
            }

            if (times) {
                this.putTimes(rows, times)
            }

            this.diaries = rows
            this.setShowDay(showDayRow, showDayCol, showDayDay)
        },

        putTimes (rows, times) {
                // Put time to table
                times.forEach(time => {
                    let date = new Date(time.created_at)
                    let day = date.getDate()
                    let weekday = date.getDay()

                    let startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

                    let row = Math.ceil((day + startDay) / 7) - 1

                    if (time.type == 0) {
                        rows.data[row][weekday].time = time.time
                    }
                    else if (time.type == 1) {
                        rows.timeWeek[row - 1] = time.time
                    }
                    else if (time.type == 2) {
                        this.timeMonth = time.time
                    }
                })
        },

        parseMarkdown (text) {
            let markedText = marked.parse(text)
            let cleanText = DOMPurify.sanitize(markedText, {FORBID_TAGS: ['style'], FORBID_ATTR: ['style']})
            return cleanText
        },

        caculateTime (start, end) {
            let startTime = new Date(start)
            let stopTime = new Date(end)
            let timeDiff = stopTime.getTime() - startTime.getTime()
            let minutes = Math.round(timeDiff / 60000)
            let hours = (minutes / 60).toFixed(2)

            return `${minutes} phút (${hours} giờ)`
        },

        setShowDay (row, col, day) {
            this.showDay.diary = this.diaries.data[row][col].diary
            this.showDay.day = day
            this.showDay.title = `${day}/${this.month}/${this.year}`

            // Reset active style
            for (let i = 0; i < this.diaries.data.length; i++) {
                for (let j = 0; j < this.diaries.data[i].length; j++) {
                    this.diaries.data[i][j].isActive = false
                }
            }

            this.diaries.data[row][col].isActive = true
        },

        dayBackground (length) {
            let result = this.dayColors[length]
            
            if (result) {
                return result
            }

            return this.dayColors[this.dayColors.length - 1]
        },

        saveSessionData (url, data) {
            sessionStorage.setItem(url, JSON.stringify(data))
        },

        loadSessionData (url) {
            let sessionData = sessionStorage.getItem(url)
            if (!sessionData) return false

            let data = JSON.parse(sessionData)

            this.showDay.diary = []
            this.putDiary(data.diaries, data.times)

            return true
        }
    },

    watch: {
        refeshToogle: {
            handler () {
                this.getDiaries()
            },
            deep: true
        },

        date: {
            handler (value) {
                let data = value.split('-')
                this.year = data[0]
                this.month = data[1]

                this.getDiaries()
            }
        }
    }
}
</script>

<style scoped>
table {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    padding-top: 1rem;
    border-radius: .5rem;
}

table p {
    display: block;
    cursor: pointer;
    text-align: center;
    border-radius: .5rem;
    padding: .5rem 1rem;
    margin: 0;
    transition: box-shadow .5s;
}

.date {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    padding: 0 1rem;
    border-radius: 1rem;
    background-color: #ff907f;
    color: #fff;
    font-weight: bold;
}

input[type="month"] {
    display: inline-block;
    padding: .5rem 1rem;
    border-radius: .5rem;
    border: 1px solid #ff907f;
}

input[type="month"]:focus {
    outline: 2px solid #ff907f;
}

.color-help {
    text-align: right;
    margin-right: 1rem;
}

.color-help span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin: 0 1px;
    border-radius: 50%;
}

</style>