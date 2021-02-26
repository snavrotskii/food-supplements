import React, { useState } from 'react';

class Search extends React.Component {
  componentDidMount() {
    fetch('/data_ru.json')
      .then(res => res.json())
      .then(json => {
        var lunr = require('lunr')
        require('lunr-languages/lunr.stemmer.support')(lunr)
        require('lunr-languages/lunr.multi')(lunr)
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

        this.setState({ index: lunrIndex, documents: documents, results: results })
      });
  }

  render() {
    return (
      <div className="search-form">
        <h1 className="search-form__title">Проверка пищевых добавок</h1>
        <input
          onInput={(e) => {
            const results = this.state.index.search(e.target.value)
              .map((searchResult) => this.state.documents[searchResult.ref]);

            this.setState({ results: results });
          }}
        />
        <div className="search-form__results">
          {
            this.state?.results?.length
              ? this.state?.results?.map((result, index) => {
                return <div key={index} className={`search-form__result_${result.level}`}>
                  <span></span>
                  <p>{result.code}</p>
                  <p>{result.title}</p>
                  <p>{result.type}</p>
                </div>;
              })
              : <div>Не найдено</div>
          }
        </div>
      </div>
    );
  }
}

export default Search;
