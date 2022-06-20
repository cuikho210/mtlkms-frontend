<template>
<div>
    <div class="header">
        <span @click="insert('**Bold text**')" class="material-icons btn-icon" title="In đậm">format_bold</span>
        <span @click="insert('*Italic text*')" class="material-icons btn-icon" title="In nghiêng">format_italic</span>
        <span @click="insert('> Quote')" class="material-icons btn-icon" title="Quote">format_quote</span>
        <span @click="insert('* List Item')" class="material-icons btn-icon" title="Generic List">format_list_bulleted</span>
        <span @click="insert('1. List Item')" class="material-icons btn-icon" title="Numbered List">format_list_numbered</span>
        <span @click="insert('[Alias](https://)')" class="material-icons btn-icon" title="Link">insert_link</span>
        <span @click="insert('![alt](https://)')" class="material-icons btn-icon" title="Image">insert_photo</span>
    </div>

    <textarea
    :rows="rows"
    :placeholder="placeholder"
    v-model="value"
    @keydown="onKeyDown($event)"
    ></textarea>
</div>
</template>

<script>
export default {
    name: 'TextArea',

    props: {
        modelValue: {
            type: String
        },
        placeholder: {
            type: String
        },
        rows: {
            type: Number,
            default: 30
        }
    },

    emits: ['update:modelValue'],

    computed: {
        value: {
            get () {
                return this.modelValue
            },
            set (value) {
                this.$emit('update:modelValue', value)
            }
        }
    },

    methods: {
        insert(text) {
            this.value = this.value + text
        },

        onKeyDown (e) {
            if (e.key == 'Tab') {
                e.preventDefault()
                let startText = this.value.slice(0, e.target.selectionStart)
                let endText = this.value.slice(e.target.selectionStart)
                this.value = `${startText}\t${endText}`
                e.selectionEnd = e.selectionStart + 1
            }
        }
    }
}
</script>

<style scoped>
.btn-icon {
    cursor: pointer;
    display: inline-block;
    padding: .5rem;
    border-radius: 50%;
    transition: background-color .5s;
}

.btn-icon:hover {
    background-color: #f5f5f5;
}
</style>