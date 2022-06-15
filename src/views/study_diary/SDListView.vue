<template>
<div class="container">
    <!-- List learning tags -->
    <h3>Đang học</h3>
    
    <div v-if="learningTags.length == 0">
        Bạn hiện chưa học gì
    </div>
    <div v-else class="grid-list">
        <div v-for="(tag, index) of learningTags" :key="index">
            <div class="grid-item" :style="{backgroundColor: tag.bg_color, color: tag.text_color}">
                <div class="title">
                    <router-link
                    class="d-flex align-items-center"
                    :to="`/study-diary/${tag.id}`"
                    :id="`sdtag_${tag.id}`">
                        <span class="material-icons mr-2">{{ tag.icon }}</span>
                        <b>{{ tag.name }}</b>
                    </router-link>

                    <div>
                        <button>
                            <span class="material-icons">edit</span>
                        </button>

                        <button>
                            <span class="material-icons">delete_forever</span>
                        </button>
                    </div>
                </div>
                
                <div class="body">
                    <p>Hôm nay: {{ showTime(tag.time_today) }}</p>
                    <p>Tuần này: {{ showTime(tag.time_week) }}</p>
                    <p>Tháng này: {{ showTime(tag.time_month) }}</p>
                    <p>Năm nay: {{ showTime(tag.time_year) }}</p>
                    <p>Tổng thời gian học: {{ showTime(tag.time_total) }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- List of tags -->
    <div class="d-flex justify-space-between align-items-center">
        <h3>Thẻ Lĩnh Vực</h3>

        <button
        class="btn btn-primary"
        @click="openCreateTagPopup">
            <span class="material-icons mr-2">add</span>
            Thêm
        </button>
    </div>

    <div v-if="tags.length == 0">
        Bạn chưa tạo thẻ nào
    </div>
    <div v-else class="grid-list">
        <div v-for="(tag, index) of tags" :key="index">
            <div class="grid-item" :style="{backgroundColor: tag.bg_color, color: tag.text_color}">
                <div class="title">
                    <router-link
                    class="d-flex align-items-center"
                    :to="`/study-diary/${tag.id}`"
                    :id="`sdtag_${tag.id}`">
                        <span class="material-icons mr-2">{{ tag.icon }}</span>
                        <b>{{ tag.name }}</b>
                    </router-link>

                    <div>
                        <button @click="openEditTagPopup(index)">
                            <span class="material-icons">edit</span>
                        </button>

                        <button @click="openDeleteTagPopup(index)">
                            <span class="material-icons">delete_forever</span>
                        </button>
                    </div>
                </div>
                
                <div class="body">
                    <p>Hôm nay: {{ showTime(tag.time_today) }}</p>
                    <p>Tuần này: {{ showTime(tag.time_week) }}</p>
                    <p>Tháng này: {{ showTime(tag.time_month) }}</p>
                    <p>Năm nay: {{ showTime(tag.time_year) }}</p>
                    <p>Tổng: {{ showTime(tag.time_total) }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit tag popup -->
    <Transition name="fade-in">
        <div class="popup" v-show="editTagData.isDisplay">
            <div class="popup-bg" @click="editTagData.isDisplay = false"></div>

            <div class="container container-sm">
                <!-- Header -->
                <div>
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="material-icons mr-2">edit</span>
                        <h3>{{ editTagData.title }}</h3>
                    </div>

                    <span class="material-icons btn-close" @click="editTagData.isDisplay = false">close</span>
                </div>

                <!-- Body -->
                <div>
                    <!-- Preview -->
                    <p>Preview: </p>

                    <div class="grid-item"
                    :style="{
                        backgroundColor: editTagData.bgColor,
                        color: editTagData.textColor
                    }">
                        <div class="title">
                            <div class="d-flex align-items-center">
                                <span class="material-icons mr-2">{{ editTagData.icon }}</span>
                                <b>{{ editTagData.name }}</b>
                            </div>

                            <button>
                                <span class="material-icons">edit</span>
                            </button>
                        </div>
                        
                        <div class="body">
                            <p>Hôm nay: {{ editTagData.times.today }} giờ</p>
                            <p>Tuần này: {{ editTagData.times.week }} giờ</p>
                            <p>Tháng này: {{ editTagData.times.month }} giờ</p>
                            <p>Năm nay: {{ editTagData.times.year }} giờ</p>
                            <p>Tổng: {{ editTagData.times.total }} giờ</p>
                        </div>
                    </div>
                    <br>
                    <hr>

                    <!-- Edit -->
                    <form action="" @submit.prevent="submitEditTag">
                        <div class="mb-3 mt-3">
                            <span class="mr-3">
                                <span class="mr-3">Màu nền</span>
                                <input type="color" v-model="editTagData.bgColor" required>
                            </span>

                            <span>
                                <span class="mr-3">Màu chữ</span>
                                <input type="color" v-model="editTagData.textColor" required>
                            </span>
                        </div>
                        <hr>

                        <div class="mt-3 mb-3">
                            <p>Icon: </p>

                            <span v-for="(icon, index) of icons" :key="index">
                                <span
                                class="material-icons btn-icon"
                                @click="editTagData.icon = icon"
                                >
                                    {{ icon }}
                                </span>
                            </span>
                        </div>
                        <hr>

                        <div class="mt-3 mb-4">
                            <p>Tên: </p>

                            <label class="input">
                                <span class="material-icons">tag</span>
                                <input type="text" v-model="editTagData.name" placeholder="Tên thẻ" required>
                                <p>Tên thẻ</p>
                            </label>
                        </div>

                        <button class="btn btn-primary">
                            <span class="material-icons mr-2">save</span>
                            Lưu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Delete tag popup -->
    <Transition name="fade-in">
        <div class="popup" v-show="deleteTagData.isDisplay">
            <div class="popup-bg" @click="deleteTagData.isDisplay = false"></div>

            <div class="container container-sm">
                <!-- Header -->
                <div>
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="material-icons mr-2">delete_forever</span>
                        <h3>{{ deleteTagData.title }}</h3>
                    </div>

                    <span class="material-icons btn-close" @click="deleteTagData.isDisplay = false">close</span>
                </div>

                <!-- Body -->
                <div>
                    <p>Bạn có chắc muốn xóa thẻ <b>{{ deleteTagData.name }}</b> không?</p>
                    <p>Thẻ này sẽ bị xóa vĩnh viễn.</p>

                    <div class="mt-3 mb-3">
                        <button class="btn btn-primary" @click="deleteTag">
                            <span class="material-icons mr-2">delete_forever</span>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <MessagePopup
    :title="message.title"
    :message="message.message"
    :type="message.type"
    :is-display="message.isDisplay" />
</div>
</template>

<script>
import store from '@/assets/js/store'
import MessagePopup from '@/components/MessagePopup.vue'
import api from '@/assets/js/api'

export default {
    name: 'SDListView',

    components: {
        MessagePopup
    },

    created () {
        if (!this.loadSessionData()) {
            this.getTags()
        }
    },

    data () {
        return {
            data: store.getAll(),
            tags: [],
            learningTags: [],

            editTagData: {
                title: 'Sửa thẻ',
                index: 0,
                id: 0,
                icon: '',
                name: '',
                textColor: '',
                bgColor: '',
                times: {
                    today: 0,
                    week: 0,
                    month: 0,
                    year: 0,
                    total: 0
                },
                isDisplay: false
            },

            deleteTagData: {
                title: 'Xóa thẻ',
                isDisplay: false,
                index: 0,
                id: 0,
                name: ''
            },

            icons: [
                'school', 'sports_esports', 'cake', 'self_improvement', 'water', 'nights_stay', 'sports_gymnastics', 'piano', 'music_note', 'movie', 'equalizer', 'shopping_cart', 'credit_card', 'receipt_long', 'attach_money', 'sell', 'work', 'calculate', 'edit_notifications', 'mail',
                'notifications', 'hub', 'smartphone', 'print', 'computer', 'desktop_windows', 'headphones', 'smart_toy', 'keyboard', 'memory', 'menu_book', 'star', 'library_books', 'auto_stories', 'local_library', 'import_contacts', 'sticky_note_2', 'note', 'laptop_chromebook', 'style',
                'edit', 'construction', 'draw', 'mic', 'palette', 'code', 'terminal', 'data_object', 'data_array'
            ],

            message: {
                title: '',
                message: '',
                type: '',
                isDisplay: false
            }
        }
    },

    methods: {
        getTags () {
            this.data.isLoading = true

            api.get('/study-diary/' + this.data.user.id).then(res => {
                this.data.isLoading = false

                if (res.status === 200) {
                    res.json().then(data => {
                        if (this.data.learningDiary) {
                            data.data.forEach(tag => {
                                if (tag.id == this.data.learningDiary.sdtag) {
                                    this.learningTags.push(tag)
                                }
                                else {
                                    this.tags.push(tag)
                                }
                            })
                        }
                        else {
                            this.tags = data.data
                        }

                        this.saveSessionData()
                    })
                } else {
                    res.json().then(res => {
                        console.log(res.error)

                        this.showMessage(
                            'Lỗi',
                            'Không thể lấy dữ liệu',
                            'error'
                        )
                    })
                }
            }).catch(err => {
                console.log(err)

                this.data.isLoading = false

                this.showMessage(
                    'Lỗi',
                    'Lỗi kết nối đến server',
                    'error'
                )
            })
        },

        openCreateTagPopup () {
            this.editTagData.title = 'Tạo thẻ'

            this.editTagData.id = 0
            this.editTagData.icon = 'star'
            this.editTagData.name = 'New Tag'
            this.editTagData.textColor = '#000000'
            this.editTagData.bgColor = '#ffa799'
            this.editTagData.times = {
                today: 0,
                week: 0,
                month: 0,
                year: 0,
                total: 0
            }

            this.editTagData.isDisplay = true
        },

        openEditTagPopup (index) {
            this.editTagData.title = 'Sửa thẻ ' + this.tags[index].id
            this.editTagData.index = index

            this.editTagData.id = this.tags[index].id
            this.editTagData.icon = this.tags[index].icon
            this.editTagData.name = this.tags[index].name
            this.editTagData.textColor = this.tags[index].text_color
            this.editTagData.bgColor = this.tags[index].bg_color
            this.editTagData.times.today = this.tags[index].time_today
            this.editTagData.times.week = this.tags[index].time_week
            this.editTagData.times.month = this.tags[index].time_month
            this.editTagData.times.year = this.tags[index].time_year
            this.editTagData.times.total = this.tags[index].time_total

            this.editTagData.isDisplay = true
        },

        openDeleteTagPopup (index) {
            this.deleteTagData.title = 'Xóa thẻ ' + this.tags[index].id
            this.deleteTagData.index = index
            this.deleteTagData.id = this.tags[index].id
            this.deleteTagData.name = this.tags[index].name

            this.deleteTagData.isDisplay = true
        },

        submitEditTag () {
            if (this.editTagData.id === 0) {
                this.createTag()
            } else {
                this.updateTag()
            }
        },

        createTag () {
            this.data.isLoading = true

            api.post('/study-diary', {
                name: this.editTagData.name,
                icon: this.editTagData.icon,
                bg_color: this.editTagData.bgColor,
                text_color: this.editTagData.textColor
            }).then(res => {
                this.data.isLoading = false

                if (res.status == 200) {
                    res.json().then(data => {
                        this.tags.push(data.result)
                        this.saveSessionData()

                        this.showMessage(
                            'Thành công',
                            'Thêm thẻ thành công',
                            'success'
                        )

                        this.editTagData.isDisplay = false
                    })
                }
                else {
                    res.json().then(data => {
                        console.log(data.error)

                        this.showMessage(
                            'Lỗi',
                            'Thêm thẻ thất bại',
                            'error'
                        )
                    })
                }
            }).catch(err => {
                this.data.isLoading = false

                this.showMessage(
                    'Lỗi',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )

                this.editTagData.isDisplay = false

                console.log(err)
            })
        },

        updateTag () {
            this.data.isLoading = true

            api.put('/study-diary', {
                id: this.editTagData.id,
                name: this.editTagData.name,
                icon: this.editTagData.icon,
                bg_color: this.editTagData.bgColor,
                text_color: this.editTagData.textColor
            }).then(res => {
                this.data.isLoading = false

                if (res.status == 200) {
                    res.json().then(data => {
                        this.tags[this.editTagData.index] = data.result
                        this.saveSessionData()

                        this.showMessage(
                            'Thành công',
                            'Cập nhật thẻ thành công',
                            'success'
                        )

                        this.editTagData.isDisplay = false
                    })
                }
                else {
                    res.json().then(data => {
                        console.log(data.error)

                        this.showMessage(
                            'Lỗi',
                            'Cập nhật thẻ thất bại',
                            'error'
                        )
                    })
                }
            }).catch(err => {
                this.data.isLoading = false

                this.showMessage(
                    'Lỗi',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )

                this.editTagData.isDisplay = false

                console.log(err)
            })
        },

        deleteTag () {
            this.data.isLoading = true

            api.delete('/study-diary', {
                id: this.deleteTagData.id
            }).then(res => {
                this.data.isLoading = false

                if (res.status == 200) {
                    res.json().then(() => {
                        this.tags.splice(this.deleteTagData.index, 1)
                        this.saveSessionData()

                        this.showMessage(
                            'Thành công',
                            'Xóa thẻ thành công',
                            'success'
                        )

                        this.deleteTagData.isDisplay = false
                    })
                }
                else {
                    res.json().then(data => {
                        console.log(data.error)

                        this.showMessage(
                            'Lỗi',
                            'Xóa thẻ thất bại',
                            'error'
                        )
                    })
                }
            }).catch(err => {
                this.data.isLoading = false

                this.showMessage(
                    'Lỗi',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )

                this.deleteTagData.isDisplay = false

                console.log(err)
            })
        },

        showMessage (title, message, type) {
            this.message.title = title
            this.message.message = message
            this.message.type = type
            this.message.isDisplay = !this.message.isDisplay
        },

        showTime (minutes) {
            let hours = (minutes / 60).toFixed(2)

            return `${hours} giờ (${minutes} phút)`
        },

        saveSessionData () {
            sessionStorage.setItem('tags', JSON.stringify({
                tags: this.tags,
                learningTags: this.learningTags
            }))
        },

        loadSessionData () {
            let str = sessionStorage.getItem('tags')

            if (str) {
                let tags = JSON.parse(str)

                this.tags = tags.tags
                this.learningTags = tags.learningTags
                
                return true
            }
            else {
                return false
            }
        }
    }
}
</script>

<style scoped>
/* Grid list */
.grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: .5rem;
    margin-top: 20px;
}

.grid-item {
    background-color: rgb(181, 207, 87);
    border-radius: .5rem;
    padding: 1rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.grid-item .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.grid-item .title button {
    color: inherit;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    transition: text-shadow .5s;
}

.grid-item .title button:hover {
    text-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
}

.grid-item .title a {
    color: inherit;
    text-decoration: none;
}

/* Edit tag popup */

.btn-icon {
    cursor: pointer;
    border-radius: 50%;
    padding: .5rem;
    margin: .25rem;
}

.btn-color {
    display: inline-block;
    cursor: pointer;
    border-radius: 50%;
    padding: 1rem;
    margin: .25rem;
}
</style>