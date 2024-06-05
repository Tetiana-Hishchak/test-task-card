'use strict';

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
});

function addListeners(elementId) {
  const element = document.getElementById(elementId);

  element.addEventListener('change', function(event) {
    changeOptionColor(elementId);
  });

  element.addEventListener('click', function(event) {
    makeFirstOptionBold(elementId);
  });
}
addListeners('year');
addListeners('make');
addListeners('mileage');
addListeners('model');
addListeners('trim');

function changeOptionColor(name) {
  const select = document.getElementById(name);
  const options = select.options;

  for (let i = 0; i < options.length; i++) {
    if (options[i].selected && options[i].value !== '0') {
      options[i].style.color = '#df4e3c';
      select.classList.add('selected-border');
    } else {
      options[i].style.color = '#000000';
    }
  }

  if (select.value === '0') {
    select.classList.remove('selected-border');
  }
}

function makeFirstOptionBold(name) {
  const firstOption = document.querySelector(`#${name} option:first-child`);

  firstOption.classList.add('bold-option');
}
