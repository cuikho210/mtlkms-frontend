<template>
<div>
    <div class="text-center">
        <div class="date">
            <p class="mr-2">Tháng {{ month }}</p>
            <p>Năm {{ year }}</p>
        </div>

        <input type="month" v-model="date">
    </div>

    <table>
        <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </tr>
        <tr v-for="(row, i) in diaries" :key="i">
            <td v-for="(col, j) in row" :key="j">
                <p
                :title="'Ngày ' + col.day"
                v-if="col.day != ''"
                @click="setShowDay(i, j, col.day)"
                :style="{ backgroundColor: dayBackground(col.diary.length) }">
                    {{ col.day }}
                </p>
            </td>
        </tr>
    </table>
    <hr>

    <div>
        <h3 class="mb-4">{{ showDay.title }}</h3>

        <div v-if="!showDay.isInit">
            Hôm nay bạn chưa học gì
        </div>
        <div v-else-if="showDay.diary.length == 0">
            Bạn không học gì vào ngày này
            <br><br>
        </div>
        <div
        v-else
        v-for="(diary, index) in showDay.diary"
        :key="index">
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
import api from '@/assets/js/api'
import store from '@/assets/js/store'
import { marked } from 'marked'

export default {
    name: 'ContributionDiary',

    props: {
        // User id
        user: {
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
            data: store.getAll(),
            diaries: [],
            showDay: {
                isInit: false,
                title: 'Hôm nay',
                day: 0,
                diary: []
            },
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            date: ''
        }
    },

    methods: {
        async getDiaries () {
            let url = '/study-diary/diary/'

            if (this.user != 0) {
                url += `${this.user}/${this.year}/${this.month}`
            }
            else if (this.tag != 0) {
                url += `${this.data.user.id}/${this.year}/${this.month}/${this.tag}`
            }
            else {
                url += `${this.data.user.id}/${this.year}/${this.month}`
            }

            this.data.isLoading = true

            let result = await api.get(url)
            let data = await result.json()

            this.data.isLoading = false

            if (result.status != 200) {
                throw new Error(data.error)
            }

            if (data.data.length > 0) {
                this.putDiary(data.data)
            }
            else {
                this.showDay.diary = []
                this.diaries = []
            }
        },

        putDiary (diaries) {
            let cols = [
                [], // Sun
                [], // Mon
                [], // Tue
                [], // Wed
                [], // Thu
                [], // Fri
                [] // Sat
            ]

            let rows = [
                [[],[0],[],[],[],[],[]],
                [[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[]],
                cols
            ]

            let date = new Date(diaries[0].start_at)
            let startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
            let endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
            let count = 1

            for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < rows[i].length; j++) {
                    let day = count - startDay

                    if (day > 0 && day <= endDay) {
                        rows[i][j] = {
                            day: day,
                            diary: []
                        }
                    }
                    else {
                        rows[i][j] = {
                            day: '',
                            diary: []
                        }
                    }

                    count++
                }
            }

            diaries.forEach(diary => {
                let date = new Date(diary.start_at)
                let day = date.getDate()
                let weekday = date.getDay()

                let startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

                let row = Math.ceil((day + startDay) / 7) - 1

                rows[row][weekday].diary.push(diary)

                if (date.toDateString() == new Date().toDateString()) {
                    this.showDay.diary = rows[row][weekday].diary
                    this.showDay.isInit = true
                }
            })

            this.diaries = rows
        },

        parseMarkdown (text) {
            return marked.parse(text)
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
            this.showDay.diary = this.diaries[row][col].diary
            this.showDay.day = day
            this.showDay.title = `${day}/${this.month}/${this.year}`
        },

        dayBackground (length) {
            switch (length) {
                case 0: return '#ffffff'
                case 1: return '#ff907f30'
                case 2: return '#ff907f50'
                case 3: return '#ff907f70'
                case 4: return '#ff907f90'
                case 5: return '#ff907fa0'
                case 6: return '#ff907fc0'
                case 7: return '#ff907fe0'
                default: return '#ff907f'
            }
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
    text-align: center;
    padding-top: 1rem;
    border-radius: .5rem;
}

table p {
    display: inline-block;
    cursor: pointer;
    border-radius: 50%;
    padding: .5rem .85rem;
    transition: box-shadow .5s;
}

table p:hover {
    box-shadow: 3px 3px 3px #ff907f30;
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

</style>