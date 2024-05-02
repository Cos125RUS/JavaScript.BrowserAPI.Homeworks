'use strict'

const ACCESS_KEY = '9J7E2eUNDZoBxV94vNQ68v4LJOMKghzu0MWzHUEpLSI';
const photoMap = new Map();
let page = 1;
let locked = false;

const containerEl = document.querySelector('.container');

/**
 * Построение DOM
 */
const init = async () => {
    const titleEl = document.createElement('h1');
    titleEl.innerText = 'In100g.';
    titleEl.classList.add('title');
    containerEl.appendChild(titleEl);

    loadLocalStorage();
    const photosData = await loadPhotoData(page);
    console.log(photosData);
    appendData(photosData);

    window.addEventListener('scroll', loadMore); //загрузка при прокрутки
    // containerEl.appendChild(createFooter()); //загрузка по кнопке
}

/**
 * Загрузка данных из локального зранилища
 */
const loadLocalStorage = () => {
    const storageData = JSON.parse(localStorage.getItem('in100g'));
    storageData.forEach(element => {
        photoMap.set(element.id, element);
    });
}

/**
 * Загрузка данных из unsplash
 * @returns массив данных по фотографиям (10 штук)
 */
const loadPhotoData = async (page) => {
    const url = `https://api.unsplash.com/photos?client_id=${ACCESS_KEY}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    const photosData = [];

    console.log(data);
    for (let index = 0; index < data.length - 2; index++) { 
        //Последние два элемента убираем, чтобы не было повторов
        const id = data[index].id;
        const name = data[index].user.name;
        const src = data[index].urls.regular;
        const createdAt = data[index].created_at;
        const description = data[index].description;
        let likes = data[index].likes;
        let liked = false;
        if (photoMap.get(id) && photoMap.get(id).liked) {
            liked = true;
        }
        photosData.push({ id, name, src, createdAt, description, likes, liked });
    }

    return photosData;
}

/**
 * Создание карточки поста
 * @param {*} photoData данные поста 
 * @returns новая карточка
 */
const createCard = (photoData) => {
    const cardBox = document.createElement('div');
    cardBox.classList.add('card-box');
    cardBox.dataset.id = photoData.id;

    const photoBox = document.createElement('div');
    photoBox.classList.add('photo-box');
    const photoEl = document.createElement('img');
    photoEl.src = photoData.src;
    photoEl.classList.add('photo');
    photoBox.appendChild(photoEl);
    cardBox.appendChild(photoBox);

    const infoBox = document.createElement('div');
    infoBox.classList.add('info-box');

    const contentInfoBox = document.createElement('div');
    contentInfoBox.classList.add('content-info-box');

    const likesBox = document.createElement('div');
    likesBox.classList.add('likes-box');
    likesBox.innerHTML = `<svg class="like" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path id="${photoData.id}" fill="black" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
    likesBox.querySelector('path').addEventListener('click', like);

    const likesCounterEl = document.createElement('p');
    likesCounterEl.classList.add('counter');
    likesCounterEl.innerText = photoData.likes;
    likesBox.appendChild(likesCounterEl);

    const authorEl = document.createElement('p');
    authorEl.classList.add('author');
    authorEl.innerText = photoData.name;

    contentInfoBox.appendChild(likesBox);
    contentInfoBox.appendChild(authorEl);

    infoBox.appendChild(contentInfoBox);

    cardBox.appendChild(infoBox);

    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('description-box');
    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('description');
    descriptionEl.innerText = photoData.description;
    descriptionBox.appendChild(descriptionEl);

    cardBox.appendChild(descriptionBox);

    return cardBox;
}

/**
 * Лайк под фото
 * @param {*} event событие нажатия
 */
const like = (event) => {
    const likeEl = event.target;
    const counterEl = likeEl.closest('.likes-box').querySelector('.counter');
    const id = likeEl.getAttribute('id');
    // const url = `https://api.unsplash.com/photos/${id}/like/?client_id=${ACCESS_KEY}`;

    if (likeEl.getAttribute('fill') === 'black') {
        // const response = fetch(url, {method: 'POST'});
        likeEl.setAttribute('fill', 'red');
        counterEl.innerText = Number.parseInt(counterEl.innerText) + 1;
        photoMap.get(id).likes++;
        photoMap.get(id).liked = true;
        localStorage.setItem('in100g', JSON.stringify(Array.from(photoMap.values())));
    } else {
        likeEl.setAttribute('fill', 'black');
        counterEl.innerText = Number.parseInt(counterEl.innerText) - 1;
        photoMap.get(id).likes--;
        photoMap.get(id).liked = false;
        localStorage.setItem('in100g', JSON.stringify(Array.from(photoMap.values())));
    }
}

/**
 * Добавить данные в контейнер
 * @param {*} photosData данные о фотографиях
 */
const appendData = (photosData) => {
    photosData.forEach(photoData => {
        const card = createCard(photoData);
        containerEl.appendChild(card);
        photoMap.set(photoData.id, photoData);
        if (photoData.liked) {
            card.querySelector('path').dispatchEvent(new Event('click'));
        }
    });
}

/**
 * Создать кнопку загрузки дополнительных постов
 * @returns кнопка загрузки доп.карточек
 */
const createFooter = () => {
    const footerBox = document.createElement('div');
    footerBox.classList.add('footer');

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Upload early photos';
    loadMoreBtn.classList.add('load-more-btn');
    loadMoreBtn.addEventListener('click', async (e) => {
        footerBox.remove();
        const photosData = await loadPhotoData(++page);
        appendData(photosData);
        containerEl.appendChild(footerBox);
    });

    footerBox.appendChild(loadMoreBtn);

    return footerBox;
}

/**
 * Загрузка при прокрутке
 * @param {*} event (прокрутка)
 */
const loadMore = async (event) => {
    if (window.scrollY + window.outerHeight >= document.body.offsetHeight && !locked) {
        locked = true;
        const photosData = await loadPhotoData(++page);
        appendData(photosData);
        setTimeout(() => { locked = false; }, 1000);
    }
}



// Запуск приложения
init();