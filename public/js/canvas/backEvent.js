window.onpageshow = function(e) {
    // console.log(e.persisted, window.performance.getEntriesByType("navigation")[0].type == 2)
    if (e.persisted || (window.performance.getEntriesByType("navigation")[0].type == 2)) {
        const leave_btn = document.getElementById('leave_room');
        console.log('뒤로가기 클릭')
        alert('경고')
        leave_btn.click();
    }
}