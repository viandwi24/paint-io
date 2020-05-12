import Vue from 'vue'
import Vuex from 'vuex'
import { createSocket } from './socket'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        serverUrl: 'https://paint-io-server.herokuapp.com',
        player: { name : null },
        socket: null,
        currentScreen: 'home',
        rooms: [],
        data: {}
    },

    mutations: {
        setPlayerName(state, name) {
            state.player.name = name
        },
        setScreen(state, screen) {
            state.currentScreen = screen
        },
        socket(state, params = '') {
            let url = state.serverUrl + params
            state.socket = createSocket(url)
        },
        setRooms: (state, rooms) => state.rooms = rooms,
        setData: (state, data) => state.data = data
    },

    getters: {
        io: (state) => state.socket
    }
})

export default store