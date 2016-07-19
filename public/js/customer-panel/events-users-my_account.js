

(function(window) {
    function toggleAddress(container) {
        var container = document.getElementById(container);
        if(container.classList.contains('is-active')){
            container.classList.remove('is-active');
            container.querySelector('label').style.display = 'block';
        }else {
            container.classList.add('is-active');
            container.querySelector('label').style.display = 'none';
        }
        var address_form_container = document.getElementById('address-form');
        var address_data_container = document.getElementById('address-data');
        groundWork.animate.slideToggle(address_form_container, 300);
        groundWork.animate.slideToggle(address_data_container, 300);
    }
    function togglePhone(container) {
        var container = document.getElementById(container);
        if(container.classList.contains('is-active')){
            container.classList.remove('is-active');
            container.querySelector('label').style.display = 'block';
        }else {
            container.classList.add('is-active');
            container.querySelector('label').style.display = 'none';
        }
        var phone_form_container = document.getElementById('phone-form');
        var phone_data_container = document.getElementById('phone-data');
        groundWork.animate.slideToggle(phone_form_container, 300);
        groundWork.animate.slideToggle(phone_data_container, 300);
    }

    function togglePw(container) {
        var container = document.getElementById(container);
        if(container.classList.contains('is-active')){
            container.classList.remove('is-active');
            container.querySelector('label').style.display = 'block';
        }else {
            container.classList.add('is-active');
            container.querySelector('label').style.display = 'none';
        }
        var pw1 = document.getElementById('pw-form');
        var pw2 = document.getElementById('pw-data');
        groundWork.animate.slideToggle(pw1, 300);
        groundWork.animate.slideToggle(pw2, 300);
    }

    function toggleCc(container) {
        var container = document.getElementById(container);
        if(container.classList.contains('is-active')){
            container.classList.remove('is-active');
            container.querySelector('label').style.display = 'block';
        }else {
            container.classList.add('is-active');
            container.querySelector('label').style.display = 'none';
        }
        var cc1 = document.getElementById('cc-form');
        var cc2 = document.getElementById('cc-data');
        groundWork.animate.slideToggle(cc1, 300);
        groundWork.animate.slideToggle(cc2, 300);
    }

    function sendAjax(data,url){
        $.ajax({
            url: url,
            data :data,
            cache: false,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if(response.message){
                    showError(response.message);
                }
            },
            error: function (xhr) {
                showError('An unknown error ocurred.');
            }
        });
    }

    window.toggleAddress = toggleAddress;
    window.togglePhone = togglePhone;
    window.togglePw = togglePw;
    window.toggleCc = toggleCc;
    window.sendAjax = sendAjax;
})(window);
