<template>
<div>
    <Transition name="fade-in">
        <div class="popup" v-show="display">
            <div class="popup-bg" @click="close()"></div>

            <div class="container container-sm">
                <div :class="type">
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="material-icons mr-2">{{ icon }}</span>
                        <h3>{{ title }}</h3>
                    </div>

                    <span class="material-icons btn-close" @click="close()">close</span>
                </div>

                <div>
                    <p>{{ message }}</p>
                </div>
            </div>
        </div>
    </Transition>
</div>
</template>

<script>
export default {
    name: 'MessagePopup',

    props: {
        title: {
            type: String,
            default: '',
        },

        message: {
            type: String,
            default: ''
        },

        type: {
            type: String,
            default: 'success'
        },

        isDisplay: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            display: false
        }
    },

    methods: {
        close () {
            this.display = false
        }
    },

    watch: {
        isDisplay () {
            this.display = true
        }
    },

    computed: {
        icon () {
            switch (this.type) {
                case 'success':
                    return 'check_circle'
                case 'error':
                    return 'error'
                case 'warning':
                    return 'warning'
                default:
                    return 'check_circle'
            }
        }
    }
}
</script>

<style>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 28;
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup .popup-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 0, 0, .1), rgba(0, 0, 0, .2), rgba(0, 0, 0, 0.5));
}

.popup h3 {
    padding: 0
}

.popup .container {
    background-color: #fff;
    padding: 1rem 2rem;
    padding-top: 0;
    border-radius: .5rem;
    box-shadow: .5rem .5rem 1rem rgba(0, 0, 0, 0.1);
    max-height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
}

.popup .container > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.popup .btn-close {
    font-size: 1.5rem;
    color: #aaa;
    cursor: pointer;
    padding: .5rem;
    border-radius: 50%;
    transition: background-color .5s;
}

.popup .btn-close:hover {
    background-color: #eee;
}

.popup .error {
    color: #f44336;
}

.popup .success {
    color: #4caf50;
}

.popup .warning {
    color: #ff9800;
}
</style>