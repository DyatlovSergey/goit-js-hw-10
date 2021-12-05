import './css/styles.css';
// import FindCountry from './fetchCountries';
import debounce from 'lodash.debounce';
// import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// const DEBOUNCE_DELAY = 300;
// import articlesTpl from './templates/articles.hbs';
import countryCardTpl from './templates/country.hbs';
import countryListTpl from './templates/flag-and-name.hbs';

const refs = {
  searchForm: document.querySelector('[id = search-box]'),
  articlesContainer: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const fetchCountries = e => {
  let searchQuery = '';
  searchQuery = e.target.value;

  e.preventDefault();

  if (searchQuery === '') {
    clearArticles();
    return;
  }

  fetch(
    `https://restcountries.com/v3.1/name/${searchQuery.trim()}?fields=name,capital,population,flags,languages`,
  )
    // .then(r => r.json())
    .then(response => {
      return response.json();
    })
    // .then(appendArticles)
    .then(country => {
      if (country.length > 10) {
        onManySuitable();
        clearArticles();
        return;
      }

      if (country.length === 1) {
        clearArticles();
        const markup = countryCardTpl(country);
        refs.countryInfo.innerHTML = markup;
        return;
      }

      if (country.status === 404) {
        clearArticles();
        onError();
        return;
      }

      clearArticles();
      const markup = country.map(countryListTpl).join('');
      refs.articlesContainer.innerHTML = markup;
    })

    .catch(error => {});
};

// function appendArticles(articles) {
//   refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
// }

function onError() {
  Notify.failure('Oops, there is no country with that name.');
}

function onManySuitable() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearArticles() {
  refs.articlesContainer.innerHTML = ``;
  refs.countryInfo.innerHTML = ``;
}
refs.searchForm.addEventListener('input', debounce(fetchCountries, 300));
// https://restcountries.com/v3.1/name/{name}
// https://restcountries.com/v3.1/name/peru

// fetchCountries(name)
// https://restcountries.com/v2/{name}?fields={name.official},{capital},{population,{flags.svg},{languages}}
// https://restcountries.com/v2/all?fields=name,capital,currencies

// name.official - полное имя страны
// capital - столица
// population - население
// flags.svg - ссылка на изображение флага
// languages - массив языков
