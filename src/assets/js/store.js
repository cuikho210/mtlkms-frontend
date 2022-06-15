let data = {
    isLogin: false,
    isLoading: false,
    user: {
        id: '',
        name: '',
        email: '',
        username: '',
        slogan: '',
        created_at: ''
    },
    learningDiary: false
};

class Store {
    constructor () {

    }

    get (key) {
        return data[key];
    }

    set (key, value) {
        data[key] = value;
    }

    remove (key) {
        delete data[key];
    }
    
    clear () {
        data = {};
    }

    getAll () {
        return data;
    }
}

export default new Store()