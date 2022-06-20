import api from '@/store/api.js'

export default {
    async login ({ commit }, form) {
        commit('setIsLoading', true)

        try {
            const response = await api.post('/login', form)
            const data = await response.json()

            commit('setIsLoading', false)

            if (response.status !== 200) {
                throw new Error(data.error)
            }

            commit('setIsLogin', true)
            commit('setUserData', data.user)
            commit('setAvatarURL', data.user.username)

            return true
        }
        catch (err) {
            commit('setIsLoading', false)
            throw err
        }
    },

    async checkLogin ({ commit }) {
        commit('setIsLoading', true)

        try {
            let result = await api.get('/check-login')
            let data = await result.json()

            commit('setIsLoading', false)

            if (result.status !== 200) {
                throw new Error('Check login failed')
            }

            commit('setIsLogin', true)
            commit('setUserData', data.user)
            commit('setAvatarURL', data.user.username)

            return true
        }
        catch (err) {
            commit('setIsLoading', false)
            throw err
        }
    },

    async getLearningDiary ({ commit, state }) {
        commit('setIsLoading', true)

        try {
            let result = await api.get('/study-diary/diary/' + state.user.id)
            let data = await result.json()

            commit('setIsLoading', false)

            if (result.status == 200) {
                commit('setLearningDiary', data.data)
                return true
            }
            else {
                throw new Error(data.error)
            }
        }
        catch (err) {
            commit('setIsLoading', false)
            throw err
        }
    },

    async register ({ commit }, form) {
        commit('setIsLoading', true)

        try {
            const response = await api.post('/register', form)
            const data = await response.json()

            commit('setIsLoading', false)

            if (response.status !== 200) {
                throw new Error(data.error)
            }

            commit('setIsLogin', true)
            commit('setUserData', data.user)
            commit('setAvatarURL', data.user.username)

            return true
        }
        catch (err) {
            commit('setIsLoading', false)
            throw err
        }
    },

    async updateProfile ({ commit }, form) {
        commit('setIsLoading', true)

        try {
            const response = await api.put('/user', form)
            const data = await response.json()

            commit('setIsLoading', false)

            if (response.status !== 200) {
                throw new Error(data.error)
            }

            commit('setUserData', data.user)

            return true
        }
        catch (err) {
            commit('setIsLoading', false)
            throw err
        }
    },

    async updatePassword ({ commit }, form) {
        commit('setIsLoading', true)

        try {
            const response = await api.put('/user/password', form)
            const data = await response.json()

            commit('setIsLoading', false)

            if (response.status !== 200) {
                throw new Error(data.error)
            }

            return true
        }
        catch (err) {
            commit('setIsLoading', false)
            throw err
        }
    }
}