'use strict'

let currentImg = 1;

const imgEl = document.querySelector('img.current-img');

let currentEl = document.querySelector('.current');

const leftBtn = document.querySelector('button.arrow.left.nav-button');
const rightBtn = document.querySelector('button.arrow.right.nav-button');

const changePicture = (step, stop, jump) => {
    document.querySelector(`.btn${currentImg}`).classList.remove('current');
    let nextImg = currentImg === stop ? jump : currentImg + step;
    imgEl.src = imgEl.src.replace(`${currentImg}.jpg`, `${nextImg}.jpg`);
    currentImg = nextImg;
    currentEl = document.querySelector(`.btn${currentImg}`);
    currentEl.classList.add('current');
}

leftBtn.addEventListener('click', () => changePicture(-1, 1, 6));
rightBtn.addEventListener('click', () => changePicture(1, 6, 1));

const dotsBox = document.querySelector('div.dots');
dotsBox.addEventListener('click', function (e) {
    currentEl.classList.remove('current');
    const btnEl = e.target.closest('button.dot');
    btnEl.classList.add('current');
    const index = btnEl.dataset.index;
    imgEl.src = imgEl.src.replace(`${currentImg}.jpg`, `${index}.jpg`);
    currentImg = Number.parseInt(index);
    currentEl = btnEl;
});