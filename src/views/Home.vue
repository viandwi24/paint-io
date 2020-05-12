<template>
    <div class="page">
        <div class="wrapper">
            <h1 class="title">Paint.io</h1>
            <input type="text" class="form-control mb-2" placeholder="your name..." v-model="name">
            <button class="btn btn-outline-white btn-block" @click="play">Play</button>
            <div class="footer mt-4 text-center">
                &copy; 2020 by viandwi24
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: null
        }
    },
    methods: {
        play() {
            let data = { screen: 'lobby', name: this.name }
            this.$emit('changeScreen', data)
        }
    }
}
</script>

<style scoped>
    .page * { color: white; }
    .page {
        height: 100%;
        padding: 2rem;
        background: #eb6383;
        position: relative;
    }
    .wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .title {
        font-size: 5rem;
    }
    .btn-outline-white {
        color: white;
        border-color: white;
    }
    .btn-outline-white:hover {
        background: white;
    }
    .form-control { color:#495057; }
</style>