import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');



input.addEventListener('input', debounce(inputCountriues, DEBOUNCE_DELAY));

function inputCountriues(e) {
  const input = e.target.value.trim();
  const url = `https://restcountries.com/v3.1/name/${input}?fields=name,capital,population,flags,languages`;
  fetchCountries(url)
    .then(response => {
      if (!response.ok) {
        cleaeMarcup();
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
    list.innerHTML = marcup;
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
    info.innerHTML = marcup;
  }
}

function cleaeMarcup() {
  list.innerHTML = '';
  info.innerHTML = '';
}
