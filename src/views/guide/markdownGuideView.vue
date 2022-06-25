<template>
<div class="container container-md">
    <p v-html="parseMarkdown(content)">

    </p>
</div>
</template>

<script>
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import 'highlight.js/styles/github.css'

import content from './markdownGuideContent'

marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-'
})

export default {
    name: 'markdownGuideView',

    data () {
        return {
            content: content
        }
    },

    methods: {
        parseMarkdown (text) {
            let markedText = marked.parse(text)
            let cleanText = DOMPurify.sanitize(markedText, {FORBID_TAGS: ['style'], FORBID_ATTR: ['style']})
            return cleanText
        }
    }
}
</script>