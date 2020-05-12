<template>
    <div class="app">
        <component :is="currentScreen" @changeScreen="changeScreen" :data="data"></component>
    </div>
</template>

<script>
import Home from './views/Home'
import Lobby from './views/Lobby'
import Room from './views/Room'
import Game from './views/Game'

export default {
    components: { Home, Lobby, Room, Game },
    data() {
        return {
            socket: null,
            isLoading: true,
            screen: 'home',
        }
    },
    computed: {
        currentScreen() {
            let screen = this.$store.state.currentScreen
            return this.ucfirst(screen)
        },
        data() {
            return this.$store.state.data
        }
    },
    methods: {
        ucfirst(str) {
            var firstLetter = str.slice(0,1);
            return firstLetter.toUpperCase() + str.substring(1);
        },
        changeScreen(data) {
            this.$store.commit('setScreen', data.screen)
            this.screen = data.screen
            delete data['screen']
            this.$store.commit('setData', data)

            let player = this.$store.state.player.name
            if (this.screen == 'lobby' && player == null) this.initSocket(data)
        },
        initSocket(data) {
            let player = data.name
            this.$store.commit('setPlayerName', player)

            let params = '?name=' + player
            this.$store.commit('socket', params)
        },
    }
}
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    body {
        font-family: 'Montserrat', sans-serif;
    }
    .app { height: 100vh; }
    .btn, .form-control { border-radius: 0!important; }
    .form-control { padding: 1.5rem 1.5rem!important; }
</style>