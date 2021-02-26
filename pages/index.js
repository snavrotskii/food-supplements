import React from 'react'
import Head from 'next/head'
import Search from '../components/Search.js';

class Index extends React.Component {
  render() {
    return (
      <div className="container">
        <Head>
          <title>Пишевые добавки</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Search />
        </main>
      </div>
    );
  }
}

export default Index;
