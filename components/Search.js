import React, { useState } from 'react';

class Search extends React.Component {
  componentDidMount() {
    fetch('/data_ru.json')
      .then(res => res.json())
      .then(json => {
        var lunr = require('lunr');
        require('lunr-languages/lunr.stemmer.support')(lunr);
        require('lunr-languages/lunr.multi')(lunr);
        require('lunr-languages/lunr.ru')(lunr);

        const lunrIndex = lunr(function () {
          this.use(lunr.multiLanguage('en', 'ru'));

          this.ref('code');
          this.field('code');
          this.field('title');
          this.field('level');
          this.field('type');

          json.forEach(function (doc) {
            this.add(doc);
          }, this);
        });

        const documents = new Map();

        json.forEach((document) => {
          documents[document.code] = document;
        });

        const results = lunrIndex.search("*")
          .map((searchResult) => documents[searchResult.ref]);

        this.setState({
          index: lunrIndex,
          documents: documents,
          results: results
        })
      });
  }

  render() {
    return (
      <div>
        <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-lg leading-6 font-medium text-black">Проверка пищевых добавок</h2>
          </header>
          <form className="relative">
            <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input onInput={(e) => {
              const results = this.state.index.search(`*${e.target.value}*`)
                .map((searchResult) => this.state.documents[searchResult.ref]);

              this.setState({ results: results });
            }} className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" aria-label="Введите код добавки" placeholder="Введите код добавки" />
          </form>
          <ul className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {
              this.state?.results?.length
                ? this.state?.results?.map((result, index) => {
                  return <li key={index}>
                    <a className="group block rounded-lg p-4 border border-gray-200">
                      <dl className="grid sm:block lg:grid xl:grid grid-cols-1 grid-rows-1 items-center">
                        <div>
                          <dt className="sr-only">Title</dt>
                          <dd className="leading-6 font-medium text-black">{result.title}</dd>
                        </div>
                        <div>
                          <dt className="sr-only">Category</dt>
                          <dd className="text-sm font-medium sm:mb-4 lg:mb-0 xl:mb-4">{result.code}</dd>
                        </div>
                        <div>
                          <dt className="sr-only">Users</dt>
                          <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
                          <svg className={`h-10 w-10 text-${result.level == 1 ? 'green' : ''}${result.level == 2 ? 'yellow' : ''}${result.level == 3 ? 'pink' : ''}${result.level == 4 ? 'red' : ''}${result.level == 5 ? 'brown' : ''}-400`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          </dd>
                        </div>
                      </dl>
                    </a>
                  </li>
                }) : <div>Не найдено</div>
            }
          </ul>
        </section>
      </div>
    );
  }
}

export default Search;
