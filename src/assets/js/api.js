import store from "@/assets/js/store.js";

class API {
    constructor () {
        this.host = '';

        if (location.hostname == 'localhost') {
            this.host = 'https://server.test'
        }
        else {
            this.host = 'https://cuikho.cf'
        }
    }

    get (url) {
        return fetch(this.host + url, {
            method: 'GET',
            credentials: 'include'
        })
    }

    setAvatarURL () {
        let username = store.get('user').username
        let avatarURL = this.getAvatarURL(username)

        store.set('avatarURL', avatarURL)
    }

    getAvatarURL (username) {
        return this.host + '/user/' + username + '/avatar'
    }

    post (url, data) {
        return fetch(this.host + url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    put (url, data) {
        return fetch(this.host + url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    delete (url, data) {
        return fetch(this.host + url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    updateAvatar (data) {
        let username = store.get('user').username

        return fetch(`${this.host}/user/${username}/avatar`, {
            method: 'PUT',
            credentials: 'include',
            body: data
        })
    }

    async getLearningDiary () {
        let result = await this.get('/study-diary/diary/' + store.get('user').id)
        let data = await result.json()

        if (result.status == 200) {
            return data.data
        }
        else {
            throw new Error(data.error)
        }
    }
}

export default new API()