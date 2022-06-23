<template>
<div>
    <div class="grid">
        <router-link
        class="tag"
        v-for="(tag, index) in sdTags"
        :key="index"
        :to="`/study-diary/${tag.id}`"
        :style="{backgroundColor: tag.bg_color, color: tag.text_color}">

            <div>
                <span class="material-icons mr-2">{{ tag.icon }}</span>
                <b>{{ tag.name }}</b>
            </div>

            <div>
                {{ (tag.time_total / 60).toFixed(2) }} giờ
            </div>

        </router-link>
    </div>
</div>
</template>

<script>
import api from '@/store/api'
import { mapMutations } from 'vuex'

export default {
    name: 'SDTagList',

    props: {
        userID: {
            type: Number,
            required: true
        }
    },

    created () {
        if (!this.loadSessionData()) {
            this.getSDTags()
        }
    },

    data () {
        return {
            sdTags: []
        }
    },

    methods: {
        ...mapMutations(['setIsLoading']),

        async getSDTags () {
            this.setIsLoading(true)

            try {
                let result = await api.get('/study-diary/' + this.userID)
                let data = await result.json()
                
                this.setIsLoading(false)

                if (result.status !== 200) {
                    throw new Error(data.message)
                }

                this.sdTags = data.data

                this.saveSessionData(data.data)
            }
            catch (error) {
                this.setIsLoading(false)
                console.error(error)
            }
        },

        saveSessionData (data) {
            sessionStorage.setItem('sdTags' + this.userID, JSON.stringify(data))
        },

        loadSessionData () {
            if (sessionStorage.getItem('sdTags' + this.userID)) {
                this.sdTags = JSON.parse(sessionStorage.getItem('sdTags' + this.userID))

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
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: .5rem;
    margin-top: 20px;
}

.tag {
    background-color: rgb(181, 207, 87);
    border-radius: .5rem;
    padding: 1.25rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tag > div:nth-child(1) {
    display: flex;
    align-items: center;
}
</style>