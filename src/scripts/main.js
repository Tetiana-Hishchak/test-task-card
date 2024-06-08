'use strict';

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
});

function initializeDropDown(
  dropDownWrapper, buttonSelector, listSelector,
  listItemSelector, inputSelector, itemClickHandler,
) {
  const dropDownBtn = dropDownWrapper.querySelector(buttonSelector);
  const dropDownList = dropDownWrapper.querySelector(listSelector);
  const dropDownInput = dropDownWrapper.querySelector(inputSelector);

  setupButtonToggle(dropDownBtn, dropDownList, buttonSelector, listSelector);

  setupListItemClick(dropDownList, dropDownBtn, dropDownInput,
    listItemSelector, listSelector, buttonSelector, itemClickHandler);

  setupOutsideClick(dropDownWrapper, dropDownBtn,
    dropDownList, buttonSelector, listSelector);

  setupKeyboardNavigation(dropDownBtn, dropDownList,
    buttonSelector, listSelector);
}

function setupButtonToggle(dropDownBtn, dropDownList,
  buttonSelector, listSelector) {
  const visibleClass = `${listSelector.substring(1)}--visible`;
  const activeClass = `${buttonSelector.substring(1)}--active`;

  dropDownBtn.addEventListener('click', () => {
    dropDownList.classList.toggle(visibleClass);
    dropDownBtn.classList.toggle(activeClass);
  });
}

function setupListItemClick(
  dropDownList, dropDownBtn, dropDownInput, listItemSelector, listSelector,
  buttonSelector, itemClickHandler,
) {
  const visibleClass = `${listSelector.substring(1)}--visible`;

  dropDownList.addEventListener('click', e => {
    if (e.target.matches(listItemSelector)) {
      e.stopPropagation();
      dropDownBtn.innerText = e.target.innerText;
      dropDownBtn.focus();
      dropDownInput.value = e.target.dataset.value;
      dropDownList.classList.remove(visibleClass);

      dropDownList.querySelectorAll(listItemSelector)
        .forEach(item => item.classList.remove('selected'));
      e.target.classList.add('selected');
      itemClickHandler(dropDownBtn.id, e.target);
    }
  });
}

function setupOutsideClick(
  dropDownWrapper, dropDownBtn, dropDownList, buttonSelector, listSelector,
) {
  const visibleClass = `${listSelector.substring(1)}--visible`;
  const activeClass = `${buttonSelector.substring(1)}--active`;

  document.addEventListener('click', e => {
    if (!dropDownWrapper.contains(e.target)) {
      dropDownBtn.classList.remove(activeClass);
      dropDownList.classList.remove(visibleClass);
    }
  });
}

function setupKeyboardNavigation(
  dropDownBtn, dropDownList, buttonSelector, listSelector,
) {
  const visibleClass = `${listSelector.substring(1)}--visible`;
  const activeClass = `${buttonSelector.substring(1)}--active`;

  document.addEventListener('keydown', e => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      dropDownBtn.classList.remove(activeClass);
      dropDownList.classList.remove(visibleClass);
    }
  });
}

document.querySelectorAll('.dropdown').forEach(dropDownWrapper => {
  initializeDropDown(
    dropDownWrapper,
    '.dropdown__button',
    '.dropdown__list',
    '.dropdown__list-item',
    '.dropdown__input-hidden',
    (elementId, listItem) => {
      const value = listItem.dataset.value;

      filterCards(elementId, value);
    },
  );
});

document.querySelectorAll('.sort').forEach(dropDownWrapper => {
  initializeDropDown(
    dropDownWrapper,
    '.sort__button',
    '.sort__list',
    '.sort__list-item',
    '.sort__input-hidden',
    (elementId, listItem) => {
      const dataType = listItem.getAttribute('data-type');
      const sortOrder = listItem.getAttribute('data-order');
      const sortIndicator = document.getElementById('sortIndicator');

      if (sortOrder === 'asc') {
        sortIndicator.classList.remove('desc');
        sortIndicator.classList.add('asc');
      } else if (sortOrder === 'desc') {
        sortIndicator.classList.remove('asc');
        sortIndicator.classList.add('desc');
      }

      sortElements(dataType, sortOrder);
    },
  );
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

function sortElements(dataType, sortOrder) {
  const sortContainer = document.querySelector('.product');
  const sortContent = '.card';
  const elements = Array.from(sortContainer.querySelectorAll(sortContent));

  elements.sort((a, b) => {
    let aValue = a.getAttribute(`data-${dataType}`);
    let bValue = b.getAttribute(`data-${dataType}`);

    if (dataType === 'price') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (dataType === 'name') {
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();
    }

    if (sortOrder === 'asc') {
      return (aValue > bValue) ? 1 : (aValue < bValue) ? -1 : 0;
    } else if (sortOrder === 'desc') {
      return (aValue < bValue) ? 1 : (aValue > bValue) ? -1 : 0;
    }
  });

  elements.forEach(element => sortContainer.appendChild(element));
}
