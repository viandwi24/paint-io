<template>
    <div class="page">
        <div class="wrapper">
            <h2 class="title text-center">Lobby</h2>
            <button class="btn btn-sm btn-outline-white btn-block" @click="createRoom">Buat Room</button>
            <hr class="mb-4">
            <div class="list" v-for="(room, i) in rooms" :key="i" @click="joinRoom(room)">
                <div class="list-title">Room {{ room.name }}</div>
                <div class="list-description text-muted">
                    {{ room.state }} |
                    Member : {{ room.members.length + 1 }} |
                    Host : {{ room.host }}
                </div>
            </div>

            <div class="list alert" v-if="rooms.length == 0">
                <div class="list-title">Tidak ada.</div>
                <div class="list-description text-muted">
                    Klik buat room untuk bermain.
                </div>
            </div>

            <hr class="mt-4">
            <div class="footer mt-4 text-center">
                &copy; 2020 by viandwi24
            </div>
        </div>
        <loading :active.sync="isLoading"  :can-cancel="false" :is-full-page="true"></loading>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        isLoading() {
            let player = this.$store.state.player
            if (player.name == null) return true
            return false
        },
        rooms() {
            return this.$store.state.rooms
        }
    },
    methods: {
        createRoom() {
            this.$store.state.socket.emit('create-room')
            return
        },
        joinRoom(room) {
            if (room.state == 'play') 
            {
                alert('Room is playing. cannt join.')
                return
            }
            this.$store.state.socket.emit('join-room', room.name)
        }
    }
}
</script>

<style scoped>
    hr {
        border: 0;
        height: 0px;
        border-top: 5px solid #FFFFFF;
        margin-bottom: 2em;
    }
    .page * { color: white; }
    .page {
        height: 100%;
        padding: 2rem;
        background: #6886c5;
        position: relative;
    }
    .wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .title {
        font-size: 4rem;
    }
    .btn-outline-white {
        color: white;
        border-color: white;
    }
    .btn-outline-white:hover {
        background: white;
    }
    .list {
        background: white;
        padding: 1rem 2rem;
        box-shadow: 0 1px 3px rgba(0, 9, 61, .16);
        transition: .2s ease-in;
        cursor: pointer;
        min-width: 400px;
    }
    .list:hover {
        transform: scale(1.1);
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    .list * { color: black; }
    .list-title { font-size: 1.5rem; font-weight: bold; }
    .list.alert { cursor: default; }
    .list.alert:hover { transform: none; box-shadow: 0 1px 3px rgba(0, 9, 61, .16); }
</style>