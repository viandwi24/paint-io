<template>
    <div class="page">        
        <div class="row">
            <div class="col">
                <canvas ref="canvas" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove"></canvas>
            </div>
            <div class="col">
                <div class="time">
                    <div>Time :</div>
                    <div v-if="time == null" class="text-center" style="width: 70px;">-</div>
                    <div style="width: 70px;" class="text-center" v-else>{{ currentTime }}</div>
                </div>

                <div class="chat-widget mt-4">
                    <div class="chatbox" ref="chatbox">
                        <div class="chat-title">Chatbox</div>
                        <div class="chat-wrapper" v-for="(chat, i) in chats" :key="i">
                            <div class="chat">
                                <div class="user text-muted">{{ chat.user }}</div>
                                <div class="text">{{ chat.text }}</div>
                            </div>
                        </div>
                    </div>
                    <input @keypress.enter="submitAnswer" type="text" class="form-control" placeholder="Place Your Answer... Enter for send..." :disabled="!myFilltext" v-model="txtAnswer">
                </div>

                <div class="canvas-control">

                </div>
            </div>
        </div>
        <div class="footer mt-4 text-center">
            &copy; 2020 by viandwi24
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    props: ['data'],
    data() {
        return {
            canvas: null,
            ctx: null,
            isDrawing: false,
            fillStyle: "#000",
            myDraw: false,
            myFilltext: false,
            time: null,
            txtAnswer: '',

            room: {},
            chats: [],
            answer: '',
        }
    },
    watch: {
        chats() {
            let chatbox = this.$refs.chatbox
            chatbox.scrollTop = chatbox.scrollHeight;
            setTimeout(() => $(chatbox).animate( { scrollTop: $(chatbox)[0].scrollHeight } ), 100)
        }  
    },
    computed: {
        currentTime() {
            return this.time
        }
    },
    mounted() {
        this.$store.state.socket.on('room-change-' + this.data.room.name, (data) => {
            this.room = data
        })
        this.$store.state.socket.on('gameplay-update', (data) => this.gameplayUpdate(data) )
        this.$store.state.socket.on('broadcast', (data) => {
            this.chats.push({ user: data.user, text: data.text })
        })

        this.chats.push({ user: this.data.room.host, text: 'create a room' })
        this.data.room.members.forEach(member => {
            this.chats.push({ user: member, text: 'joined game' })
        });

        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = 600;
        this.canvas.height = 500;
        this.clearTo("#FFF");
    },
    methods: {
        gameplayUpdate(data) {
            let player = this.$store.state.player
            if (data.state != 'update-canvas') console.log(data)


            switch (data.state) {
                case 'choose-drawer':
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.chats.push({ user: '[SYSTEM]', text: 'Waiting a server choose a drawer.' })
                    break;
            
                case 'player-draw':
                    if (data.data.player_draw.name == player.name) {
                        this.myDraw = true
                        this.chats.push({ user: '[SYSTEM]', text: 'You Draw!' })
                        this.chats.push({ user: '[SYSTEM]', text: 'Draw a ' + data.data.draw_object + ' in canvas!' })
                        this.timer(20, () => {
                            this.time = null
                            this.myDraw = false
                        })
                    } else {
                        this.chats.push({ user: '[SYSTEM]', text: data.data.player_draw.name + ' a drawer!' })
                        this.timer(20, () => {
                            this.time = null
                        })
                    }
                    break;

                
                case 'answer-time':
                    this.time = 0
                    this.myDraw = false
                    if (data.data.player_draw.name != player.name) {
                        this.answer = data.data.draw_object
                        this.chats.push({ user: '[SYSTEM]', text: 'Drawer has finished draw.' })
                        this.chats.push({ user: '[SYSTEM]', text: 'please answer, what did he draw' })
                        this.myFilltext = true
                        this.timer(10, () => {
                            this.time = null
                            this.myFilltext = false
                        })
                    } else {
                        this.chats.push({ user: '[SYSTEM]', text: 'Draw Time is timeout.' })
                        this.chats.push({ user: '[SYSTEM]', text: 'Waiting all player anwser.' })
                        this.timer(10, () => {
                            this.time = null
                        })
                    }
                    break;
                
                case 'answer-timeout':
                    this.time = null
                    this.myFilltext = false
                    this.chats.push({ user: '[SYSTEM]', text: 'answer time is timeout!' })
                    break;
                
                case 'update-canvas':
                    if (data.data.player_draw.name != player.name) {
                        var img = new Image;
                        let vm = this
                        img.onload = function(){ 
                            vm.ctx.drawImage(img,0,0);
                        };
                        img.src = data.data.canvas
                    }
                    break;

                default:
                    break;
            }
        },
        submitAnswer() {
            let player = this.$store.state.player
            console.log({aku: this.txtAnswer, aslinya: this.answer})
            if (this.txtAnswer.toLowerCase() == this.answer) {
                this.chats.push({ user: '[SYSTEM]', text: 'Your answer is correct!!!' })
                this.myFilltext = false
                this.$store.state.socket.emit('client-gameplay-update', { state: 'answer-correct', room: this.room, player: player.name } )
            } else {
                this.chats.push({ user: '[SYSTEM]', text: 'Your answer is wrong! try again...' })
            }
            this.txtAnswer = ''
        },
        timer(time, callback) {
            this.time = time
            if (time > 0) {
                return setTimeout(() => this.timer(time-1, callback), 1000)
            } else {
                return callback()
            }
        },
        mousedown() { this.isDrawing = true },
        mouseup() { this.isDrawing = false },
        mousemove(e) {
            if (!this.isDrawing || !this.myDraw) {
               return;
            }
            var rect = this.canvas.getBoundingClientRect();
            var x = e.pageX - rect.left;
            var y = e.pageY - rect.top;
            var radius = 5; // or whatever
            var fillColor = '#000';
            this.fillCircle(x, y, radius, fillColor);
            
            let dataCanvas = this.getContentCanvas()
            this.$store.state.socket.emit('client-gameplay-update', { state: 'update-canvas', room: this.room.name, canvas: dataCanvas })
        },
        getContentCanvas() {
            // let ctx = this.ctx
            // return ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
            return this.canvas.toDataURL()
        },
        fillCircle (x, y, radius, fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            this.ctx.fill();
        },
        clearTo (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
        background: #16817a;
        position: relative;
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
    canvas {
        background: white;
    }
    .chatbox { border: 1px solid white; padding: .5rem; min-height: 300px; max-height: 300px; overflow-y: scroll; }
    .chatbox .chat-title { color: white; border-bottom: 3px solid white; margin-bottom: .8rem; }
    .chatbox .chat { background: white; padding: .3rem .5rem; display: inline-block; padding-right: 3rem; }
    .chatbox * { color: black; }
    .chatbox .chat .user { font-size: .7rem; }
    .chatbox .chat .text { font-size: 1.2rem; }
    .chatbox .chat-wrapper { margin-bottom: 1rem; }
    .time div {
        display: inline-block;
        background: white;
        color: black;
        padding: .8rem;
    }
    .time div:nth-child(1) {
        border-right: 1px solid black;
    }
    .form-control { color: black; }
</style>