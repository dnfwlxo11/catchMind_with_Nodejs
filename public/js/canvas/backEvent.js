import main from './main.js'

// window.onpageshow = function(e) {
//     console.log(e.persisted, window.performance, window.performance.getEntriesByType("navigation")[0].type == 2)
//     if (e.persisted || (window.performance && window.performance.getEntriesByType("navigation")[0].type.toString === 'back_forward')) {
//         console.log('뒤로가기 클릭')
//         window.location.reload();
//     }
// }

// history.pushState(null, null, location.href);
// console.log(location.href, typeof(location.href))
// window.onpopstate = function(e) {
//     history.pushState(null, null, '/')
// }

window.onkeydown = function(e) {
    if (e.keyCode == 505) {
        alert('진짜 나가실 건가요?');
        window.onBeforeUnload
    }

    if (e.keyCode == 115) {
        alert('진짜 나가실 건가요?');
        window.onBeforeUnload
    }
}

window.onhashchange = function() {
    console.log('asd')
    // main.leaveRoom();
}

window.onbeforeunload = function (e) {
    e.preventDefault();
    main.leaveRoom();
    socket.emit('updateUsers');
    window.location.reload();
    window.onbeforeunload = false;
}