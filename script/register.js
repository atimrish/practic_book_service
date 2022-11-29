const form_container = document.querySelector('.form-container');


const form = form_container.querySelector('#form-register');
const circles = document.querySelectorAll('.base-circle');
const lines = document.querySelectorAll('.line');
const header_register = form_container.querySelector('.form-title');
let inputs = Array.from(form_container.querySelectorAll('input'));
let labels = form_container.querySelectorAll('label');

const link_data = {
    bool_login_check: false
}



console.log('file is opened');

function inputFocusEvent() {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onfocus = () => {
            labels[i].classList.add('input-focus');
        };
        inputs[i].addEventListener('focusout', () => {
            labels[i].classList.remove('input-focus');
        });
    }
}

inputFocusEvent();

const titles = [
    'Введите свои личные данные',
    'Введите логин и пароль',
    'Подтвердите пароль',
    'Выберите изображение профиля'
];


const forms = [
    `
            <div class="input-container">
                <label for="surname">Фамилия</label>
                <input type="text" name="surname" id="surname">
            </div>

            <div class="input-container">
                <label for="name">Имя</label>
                <input type="text" name="name" id="name">
            </div>

            <div class="input-container">
                <label for="patronymic">Отчество</label>
                <input type="text" name="patronymic" id="patronymic">
            </div>

            <div>
                <button type="submit">Далее</button>
            </div>
    `,

    `
            <div class="input-container">
                <label for="login">Логин</label>
                <input type="text" name="login" id="login">
            </div>

            <div class="input-container">
                <label for="password">Пароль</label>
                <input type="text" name="password" id="password">
            </div>

            <div class="btn-container">
                <button type="button" onclick="stepBack()">Назад</button>
                <button type="submit">Далее</button>
            </div>
            `,
    `   
            <div class="input-container">
                <label for="password_confirm" style="display: none">Пароль</label>
                <input type="text" name="password_confirm" id="password_confirm">
            </div>

            <div class="btn-container">
                <button type="button" onclick="stepBack()">Назад</button>
                <button type="submit">Далее</button>
            </div>   
        `,
    `
            <div class="input-container">
                <label for="profile_picture" style="display: none">Логин</label>
                <input type="file" name="profile_picture" id="profile_picture">
            </div>
            
            <div class="btn-container">
                <button type="button" onclick="stepBack()">Назад</button>
                <button type="submit">Готово</button>
            </div>
    
    `


];



let step = 0;
let formData = new FormData();
formData.append('surname', '');
formData.append('name', '');
formData.append('patronymic', '');
formData.append('login', '');
formData.append('password', '');
formData.append('password_confirm', '');
formData.append('avatar', '');



form.onsubmit = (e) => {
    e.preventDefault();
    checkForm();
    if (step === 2 ) {

        if (formData.get('password') === formData.get('password_confirm')) {
            console.log('Пароли соипадают');
            printForm();
        } else {
            pushNotice('Пароли не совпадают');
        }
    } else if (step === 1) {
        console.log(checkLogin(formData.get('login'), link_data));

        if (link_data.bool_login_check) {
            printForm();
        }

    }
    else {
        printForm();
    }

    console.log(step);




};


function stepBack() {
    circles[step].classList.remove('circle-animation');
    circles[step].classList.add('circle-not-done');
    circles[step].classList.remove('circle');
    circles[step].innerHTML = '';
    step--;
    lines[step].classList.remove('line-animation');
    lines[step].classList.add('line-animation-reverse');
    header_register.innerHTML = titles[step];
    form.innerHTML = forms[step];
    inputs = Array.from(form_container.querySelectorAll('input'));
    labels = form_container.querySelectorAll('label');
    circles[step].innerHTML = '';
    inputFocusEvent();
}


function checkForm() {
    switch (step) {
        case 0:
            let surname = inputs.find((value) => {
                return value.getAttribute('name') === 'surname';
            });
            let name = inputs.find((value) => {
                return value.getAttribute('name') === 'name';
            });
            let patronymic = inputs.find((value) => {
                return value.getAttribute('name') === 'patronymic';
            });
            formData.set('surname', surname.value);
            formData.set('name', name.value);
            formData.set('patronymic', patronymic.value);
            break;


        case 1:
            let login = inputs.find((value) => {
                return value.getAttribute('name') === 'login';
            });
            let password = inputs.find((value) => {
                return value.getAttribute('name') === 'password';
            });
            formData.set('login', login.value);
            formData.set('password', password.value);

            break;


        case 2:
            let password_confirm = inputs.find((value) => {
                return value.getAttribute('name') === 'password_confirm';
            });
            formData.set('password_confirm', password_confirm.value);
            break;


        case 3:
            let profile_picture = inputs.find((value) => {
                return value.getAttribute('name') === 'profile_picture';
            });
            formData.set('avatar', profile_picture.value);
            console.log(formData);

            addUser(formData);

            break;


    }
}


function printForm() {
    circles[step].innerHTML = '<img src="../images/method-draw-image(2).svg" alt="">';
    circles[step].classList.add('circle-animation');

    if (step < 3) {
        lines[step].classList.remove('line-animation-reverse');
        lines[step].classList.add('line-animation');
        step++;
        circles[step].classList.remove('circle-not-done');
        circles[step].classList.add('circle');
        header_register.innerHTML = titles[step];
        form.innerHTML = forms[step];

        inputs = Array.from(form_container.querySelectorAll('input'));
        labels = form_container.querySelectorAll('label');

        inputFocusEvent();
    }
}


async function addUser(formData) {

    let res = await fetch('http://practic-book-service/users', {
        method: 'POST',
        body: formData
    });
    res = await res.json();

    if (res.status === true) {
        window.location.replace('http://practic-book-service');
    }

}

async function checkLogin(login, link_data) {
    'use strict';
    const loginFormData = new FormData();
    loginFormData.append('login', login);

    let res = await fetch('http://practic-book-service/logincheck', {
        method: 'POST',
        body: loginFormData
    });
    res = await res.json();



    if (!res.status) {
        pushNotice('warning', res.message);
        link_data.bool_login_check = false;
    } else {
        link_data.bool_login_check = true;
    }

}

function pushNotice(type ,message) {

    const notice = document.createElement('div');

    switch (type) {
        case 'warning':
            notice.classList.add('push-notice-warning');
            notice.classList.add('push-notice-animation');
            notice.innerHTML = `<div class="notice-icon-warning">!</div>
            <div class="notice-body">${message}</div>`;
            break;
        case 'success':
            notice.classList.add('push-notice-success');
            notice.classList.add('push-notice-animation');
            notice.innerHTML = `<div class="notice-icon-success">V</div>
            <div class="notice-body">${message}</div>`;
            break;
        case 'error':
            notice.classList.add('push-notice-error');
            notice.classList.add('push-notice-animation');
            notice.innerHTML = `<div class="notice-icon-error">X</div>
            <div class="notice-body">${message}</div>`;
            break;
        case 'info':
            notice.classList.add('push-notice-info');
            notice.classList.add('push-notice-animation');
            notice.innerHTML = `<div class="notice-icon-info">i</div>
            <div class="notice-body">${message}</div>`;
            break;
    }



    document.body.appendChild(notice);

    setTimeout(() => {
        notice.remove();
    }, 4800);


}


