const socket = io('/'),
      videoGrid = document.getElementById('video-grid'),
      myPeer = new Peer(undefined, {
        host: '/',
        port: '3001'
      }),
      myVideo = document.createElement('video')
      myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}) .then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) socket.emit('console', peers[userId])
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

let connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream),
          videoElement = document.createElement('video')

    call.on('stream', userVideoStream => {
        addVideoStream(videoElement ,userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
    console.log(peers)
}


let addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.appendChild(video)
}