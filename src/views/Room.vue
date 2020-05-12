<template>
    <div class="page">
        <div class="wrapper">
            <h2 class="title text-center">Room</h2>
            <p class="text-center">{{ room.name }}</p>
            <button v-if="(room.host == $store.state.player.name)" :disabled="room.members.length == 0" class="btn btn-sm btn-outline-white btn-block" @click="play">Play</button>
            <hr class="mb-4">
            <div class="list alert">
                <div class="list-title">{{ room.host }}</div>
                <div class="list-description">
                    Host <span v-if="(room.host == $store.state.player.name)">| Anda</span>
                </div>
            </div>
            <div class="list alert" v-for="(player, i) in room.members" :key="i">
                <div class="list-title">{{ player }}</div>
                <div class="list-description" v-if="player == $store.state.player.name">Anda</div>
                <div class="list-description" v-else>Member</div>
            </div>
            <div class="list alert" v-if="(typeof room.members !== 'undefined') && (room.members.length == 0)">
                <div class="list-title">Tidak ada player lain.</div>
            </div>
            <hr class="mt-4">
            <div class="footer mt-4 text-center">
                &copy; 2020 by viandwi24
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            room: {}
        }
    },
    methods: {
        play() {
            this.$store.state.socket.emit('room-play', this.room.name)
        },
    },
    mounted() {
        this.$store.state.socket.on('room-change-' + this.data.room.name, (data) => {
            this.room = data
        })
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
        background: #fa744f;
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