'use strict'

const ACCESS_KEY = '9J7E2eUNDZoBxV94vNQ68v4LJOMKghzu0MWzHUEpLSI';

const containerEl = document.querySelector('.container');

const init = async () => {
    const titleEl = document.createElement('h1');
    titleEl.innerText = 'In100g.';
    titleEl.classList.add('title');
    containerEl.appendChild(titleEl);

    const photoData = await loadPhotoData();
    console.log(photoData);

    const photoBox = document.createElement('div');
    photoBox.classList.add('photo-box');
    const photoEl = document.createElement('img');
    photoEl.src = photoData.src;
    photoEl.classList.add('photo');
    photoBox.appendChild(photoEl);
    containerEl.appendChild(photoBox);

    const infoBox = document.createElement('div');
    infoBox.classList.add('info-box');

    const contentInfoBox = document.createElement('div');
    contentInfoBox.classList.add('content-info-box');

    const likesBox = document.createElement('div');
    likesBox.classList.add('likes-box');
    likesBox.innerHTML = '<svg class="like" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>';

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

    containerEl.appendChild(infoBox);

    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('description-box');
    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('description');
    descriptionEl.innerText = photoData.description;
    descriptionBox.appendChild(descriptionEl);

    containerEl.appendChild(descriptionBox);

    const likeEl = document.querySelector('.like');
    likeEl.addEventListener('click', like);
}

const loadPhotoData = async () => {
    const url = `https://api.unsplash.com/photos?client_id=${ACCESS_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(data[0]);
    const name = data[0].user.name;
    const src = data[0].urls.regular;
    const createdAt = data[0].created_at;
    const description = data[0].description;
    const likes = data[0].likes;

    return { name, src, createdAt, description, likes };
}

const like = (e) => {
    const likeEl = e.target;
    const counterEl = document.querySelector('.counter');

    if (likeEl.getAttribute('fill') === 'black') {
        likeEl.setAttribute('fill', 'red');
        counterEl.innerText = Number.parseInt(counterEl.innerText) + 1;
    } else {
        likeEl.setAttribute('fill', 'black');
        counterEl.innerText = Number.parseInt(counterEl.innerText) - 1;
    }
}

init();