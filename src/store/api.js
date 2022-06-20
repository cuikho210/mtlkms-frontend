class API {
    constructor () {
        this.host = 'https://server.test'
        // this.host = 'https://vitcon.cf'
    }

    get (url) {
        return fetch(this.host + url, {
            method: 'GET',
            credentials: 'include'
        })
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

    updateAvatar (username, data) {
        return fetch(`${this.host}/user/${username}/avatar`, {
            method: 'PUT',
            credentials: 'include',
            body: data
        })
    }
}

export default new API()