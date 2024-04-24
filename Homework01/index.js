'use strict'

const containerBox = document.querySelector('.container');

/**
 * Инициализация таблицы
 */
const init = () => {
    const titleEl = document.createElement('h1');
    titleEl.textContent = 'Расписание занятий';
    titleEl.classList.add('display-4', 'text-center');
    containerBox.appendChild(titleEl);

    const tableEl = document.createElement('table');
    tableEl.classList.add('table', 'table-dark');

    const tableHeaderEl = document.createElement('thead');

    const headRowEl = document.createElement('tr');
    headRowEl.classList.add('text-center');

    const nameEl = document.createElement('th');
    nameEl.textContent = 'Название';
    headRowEl.appendChild(nameEl);

    const timeEl = document.createElement('th');
    timeEl.textContent = 'Время';
    headRowEl.appendChild(timeEl);

    const maxMembersEl = document.createElement('th');
    maxMembersEl.textContent = 'Размер группы';
    headRowEl.appendChild(maxMembersEl);

    const currentMembersEl = document.createElement('th');
    currentMembersEl.textContent = 'Текущий состав';
    headRowEl.appendChild(currentMembersEl);

    const spaceForButtonJoin = document.createElement('th');
    headRowEl.appendChild(spaceForButtonJoin);
    const spaceForButtonRemove = document.createElement('th');
    headRowEl.appendChild(spaceForButtonRemove);

    tableHeaderEl.appendChild(headRowEl);

    const tableBodyEl = loadData();

    tableEl.appendChild(tableHeaderEl);
    tableEl.appendChild(tableBodyEl);

    containerBox.appendChild(tableEl);
}

/**
 * Загрузка данных в таблицу
 * @returns tbody с заполненными данными
 */
const loadData = () => {
    const tableBodyEl = document.createElement('tbody');
    const trainingsData = getData();

    trainingsData.forEach(training => {
        training.maxMembers = Number.parseInt(training.maxMembers);
        training.currentMembers = Number.parseInt(training.currentMembers);

        const rowEl = createRow(training);
        rowEl.classList.add('text-center');

        const joinButtonTD = document.createElement('td');
        const joinButton = document.createElement('button');
        joinButton.classList.add('btn', 'btn-dark');
        joinButton.textContent = 'Записаться';
        joinButton.addEventListener('click', () => {
            if (training.currentMembers === 0) {
                leaveButton.disabled = false;
            }

            if (training.currentMembers !== training.maxMembers) {
                const currentMembersEl = rowEl.querySelector('.training__current-members');
                currentMembersEl.textContent = ++training.currentMembers;

                if (training.currentMembers === training.maxMembers) {
                    joinButton.disabled = true;
                }
            }

            localStorage.setItem('trainings', JSON.stringify(trainingsData));
        });
        joinButtonTD.appendChild(joinButton);
        rowEl.appendChild(joinButtonTD);

        const leaveButtonTD = document.createElement('td');
        const leaveButton = document.createElement('button');
        leaveButton.classList.add('btn', 'btn-dark');
        leaveButton.textContent = 'Отменить запись';
        leaveButton.addEventListener('click', function (e) {
            if (training.currentMembers === training.maxMembers) {
                joinButton.disabled = false;
            }

            if (training.currentMembers > 0) {
                const currentMembersEl = rowEl.querySelector('.training__current-members');
                currentMembersEl.textContent = --training.currentMembers;

                if (training.currentMembers === 0) {
                    leaveButton.disabled = true;
                }
            }

            localStorage.setItem('trainings', JSON.stringify(trainingsData));
        });
        leaveButtonTD.appendChild(leaveButton);
        rowEl.appendChild(leaveButtonTD);

        tableBodyEl.appendChild(rowEl);
    });

    return tableBodyEl;
}

/**
 * Получение данные о тренировках
 * @returns объект, заполненный данными о тренировках
 */
const getData = () => {
    let trainingsData = null;
    if (localStorage.getItem('trainings')) {
        trainingsData = JSON.parse(localStorage.getItem('trainings'));
    } else {
        trainingsData = JSON.parse(trainings);
    }

    return trainingsData;
}

/**
 * Создать строку таблицы
 * @param {*} training данные для заполнения
 * @returns tr, заполненная данными
 */
const createRow = (training) => {
    const rowEl = document.createElement('tr');
    const nameEl = document.createElement('td');
    nameEl.textContent = training.name;
    nameEl.classList.add('training__name');
    rowEl.appendChild(nameEl);

    const timeEl = document.createElement('td');
    timeEl.textContent = new Date(Number.parseInt(training.time)).toLocaleString('ru-RU');
    timeEl.classList.add('training__time');
    rowEl.appendChild(timeEl);

    const maxMembersEl = document.createElement('td');
    maxMembersEl.textContent = training.maxMembers;
    maxMembersEl.classList.add('training__max-members');
    rowEl.appendChild(maxMembersEl);

    const currentMembersEl = document.createElement('td');
    currentMembersEl.textContent = training.currentMembers;
    currentMembersEl.classList.add('training__current-members');
    rowEl.appendChild(currentMembersEl);

    return rowEl;
}

init();