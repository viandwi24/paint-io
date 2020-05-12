import io from 'socket.io-client'
import $store from './store'

let socketIO = io
let createSocket = (url) => {
    console.log("Connection to server...")

    // 
    let io = socketIO(url)
    let disconnectReason = null

    // 
    io.on('tes', (data) => console.log(data))
    io.on('rooms', (data) => {
        if (data.length != $store.state.rooms.length) $store.commit('setRooms', data)
    })
    io.on('joinedTo', (data) => {
        console.log("Joined to room " + data.name)
        $store.commit('setData', { room: data })
        $store.commit('setScreen', "room")
    })
    io.on('playGame', (data) => {
        console.log("Playing... at room " + data.name)
        $store.commit('setData', { room: data })
        $store.commit('setScreen', "game")
    })


    // disconnect
    io.on('disconnectReason', (data) => disconnectReason = data)
    io.on('disconnect', () => {
        console.log("Disconnect from server... " + disconnectReason)
        $store.commit('setPlayerName', null)
        $store.commit('setScreen', "home")
        if (disconnectReason != null) alert(disconnectReason)
        disconnectReason = null
        $store.commit("socket", null)
    })
    

    return io
}

export { createSocket }