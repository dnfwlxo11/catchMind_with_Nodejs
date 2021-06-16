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

window.onbeforeunload = function (e) {
    console.log(e)
    main.leaveRoom();
    socket.emit('updateUsers')
    location.reload();
}