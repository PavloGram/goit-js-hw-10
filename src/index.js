import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
const DEBOUNCE_DELAY = 500;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(inputCountriues, DEBOUNCE_DELAY));

function inputCountriues(e) {
  const inputValue = e.target.value.trim();
  const url = `https://restcountries.com/v3.1/name/${inputValue}?fields=name,capital,population,flags,languages`;
  if (inputValue === '') {
    return cleaeMarcup();
  }
  fetchCountries(url)
    .then(response => {
      if (!response.ok) {
        return Notiflix.Notify.failure(
          'Oops, there is no country with that name'
        );
      }
      return response.json();
    })
    .then(forMarcup => {
      return marcupList(forMarcup);
    })
    .catch(er => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function marcupList(element) {
  if (element.length > 10) {
    cleaeMarcup();
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (element.length > 2 && element.length < 10) {
    cleaeMarcup();
    const marcup = element
      .map(e => {
        return `<li class="country-list__item" ><img src="${e.flags.svg}" width = 30 height = 20><p>${e.name.official}</p></li>`;
      })
      .join('');
    listEl.innerHTML = marcup;
  } else {
    cleaeMarcup();
    const marcup = element
      .map(e => {
        return `<ul class="country-info__list">
<li class="country-info__item" ><img src="${
          e.flags.svg
        }" width = 40 height = 30><h1>${e.name.official}</h1> </li>
<li><p class="country-info__text"><span class="country-info__item">Capital:</span>${
          e.capital
        }</p></li>
<li><p class="country-info__text"><span class="country-info__item">Population:</span>${
          e.population
        }</p></li>
<li><p class="country-info__text"><span class="country-info__item">Languages:</span> ${Object.values(
          e.languages
        ).join(', ')}</p> </li>
</ul>`;
      })
      .join('');
    infoEl.innerHTML = marcup;
  }
}

function cleaeMarcup() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}
