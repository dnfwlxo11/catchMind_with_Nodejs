import main from './main.js'

history.pushState(null, null, location.href);

window.onpageshow = function(e) {
    console.log(e)
    if ( e.persisted || (window.performance && window.performance.navigation.type == 2)) {
        const leave_btn = document.getElementById('leave_room');
        console.log('뒤로가기 클릭')
        alert('경고')
        leave_btn.click();
    }
}