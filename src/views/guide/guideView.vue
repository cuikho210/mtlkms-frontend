<template>
<div class="container container-sm">
    <router-link class="link" to="/guide/markdown">
        <span class="material-icons mr-2">edit_note</span>
        Hướng dẫn cú pháp Markdown (MD)
    </router-link>

    
</div>
</template>

<script>
export default {
    name: 'GuideView'
}
</script>

<style>
.link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    border-radius: .25rem;
    border: 1px solid #ff907f10;
    border-left: 3px solid #ff907f;
    transition: border-left .5s, box-shadow .5s, color .5s;
    text-decoration: none;
    color: initial;
    margin-bottom: .5rem;
}

.link:hover {
    border-left: 3px solid #ff90ff;
    box-shadow: 3px 3px 3px #ff90ff30;
    color: #ff907f;
}
</style>