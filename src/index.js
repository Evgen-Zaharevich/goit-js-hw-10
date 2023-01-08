import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputRef = document.querySelector(`#search-box`);
const countryListRef = document.querySelector(`.country-list`);
const countryInfoRef = document.querySelector(`.country-info`);

const DEBOUNCE_DELAY = 300;

inputRef.addEventListener(`input`, debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchCountry = e.target.value.trim();

  onClearInput();
  if (searchCountry === ``) {
    return;
  }

  fetchCountries(searchCountry)
    .then(country => onRenderCountriesInfo(country))
    .catch(error =>
      Notify.failure(`Oops, there is no country with that name`, {
        position: `center-top`,
      })
    );
}

function onClearInput() {
  countryListRef.innerHTML = ``;
  countryInfoRef.innerHTML = ``;
}

function onRenderCountriesInfo(countries) {
  if (countries.length > 10) {
    Notify.info(`Too many matches found. Please enter a more specific name.`, {
      position: `center-top`,
    });
  }

  if (countries.length > 2 && countries.length < 10) {
    const markup = countries
      .map(({ flags, name }) => {
        return `<div class="country-list__container"><li class="country-list__item">
        <img src="${flags.png}" alt="${name.official}" width="30" height="20" />
      </li>
      <h1 class="country-list__label">${name.official}</h1>
          </div>`;
      })
      .join('');
    countryListRef.innerHTML = markup;
  }

  if (countries.length === 1) {
    const markup = countries
      .map(({ flags, name, capital, population, languages }) => {
        return `<div class="country-list__container"><li class="country-list__item">
        <img src="${flags.svg}" alt="${name.official}" width="30" height="20" />
      </li>
      <h1 class="country-label">${name.official}</h1></div>
          <p><b class="country-subtitle">Capital: </b>${capital}</p>
            <p><b class="country-subtitle">Population: </b>${population}</p>
            <p><b class="country-subtitle">Languages: </b>${Object.values(
              languages
            )}</p>
          `;
      })
      .join('');
    countryListRef.innerHTML = markup;
  }
}
