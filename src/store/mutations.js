import api from "./api"

export default {
    setTitle (state, title) {
        document.title = title
        state.title = title
    },

    setIsLogin (state, isLogin) {
        state.isLogin = isLogin
    },

    setIsLoading (state, isLoading) {
        state.isLoading = isLoading
    },

    setUserData (state, user) {
        state.user = user
    },

    setLearningDiary (state, learningDiary) {
        state.learningDiary = learningDiary
    },

    setAvatarURL (state, username) {
        let avatarURL = api.getAvatarURL(username)

        state.user.avatarURL = avatarURL
    },

    setRedirect (state, redirect) {
        state.redirect = redirect
    },

    setUsers (state, users) {
        users.forEach(user => {
            state.users[user.username] = user
        })
    }
}