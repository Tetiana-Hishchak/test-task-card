'use strict';

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
});

const sort = document.getElementById('sort');

sort.addEventListener('change', function() {
  changeOptionColor('sort');
});

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

document.querySelectorAll('.dropdown').forEach(dropDownWrapper => {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList
    .querySelectorAll('.dropdown__list-item');
  const dropDownInput = dropDownWrapper
    .querySelector('.dropdown__input-hidden');

  dropDownBtn.addEventListener('click', e => {
    dropDownList.classList.toggle('dropdown__list--visible');
    dropDownBtn.classList.toggle('dropdown__button--active');
  });

  dropDownListItems.forEach(listItem => {
    listItem.addEventListener('click', e => {
      e.stopPropagation();
      dropDownBtn.innerText = listItem.innerText;
      dropDownBtn.focus();
      dropDownInput.value = listItem.dataset.value;
      dropDownList.classList.remove('dropdown__list--visible');
      dropDownListItems.forEach(item => item.classList.remove('selected'));
      listItem.classList.add('selected');

      filterCards(dropDownBtn.id, listItem.dataset.value);
    });
  });

  document.addEventListener('click', e => {
    if (!dropDownWrapper.contains(e.target)) {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });

  function filterCards(elementId, value) {
    const cards = document.querySelectorAll('.card');
    const conditionFunctions = {
      year: (selected, card) => selected === 'year' || +selected === +card,
      model: (selected, card) => selected === 'model' || selected === card,
      mileage: (selected, card) => selected === 'mileage' || +selected >= +card,
    };

    const conditionFunction = conditionFunctions[elementId];

    if (conditionFunction) {
      cards.forEach(card => {
        const cardValue = card.getAttribute(`data-${elementId}`);

        card.style.display = conditionFunction(value, cardValue)
          ? 'block' : 'none';
      });
    }
  }
});
