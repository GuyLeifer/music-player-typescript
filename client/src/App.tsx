// import { FC } from 'react';
import './App.css';

//packages
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RecoilRoot } from "recoil";

//components
import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import HomePage from './components/HomePage';
import About from './components/about/About';
import Footer from './components/footer/Footer';
import GenericNotFound from './components/genericNotFound/GenericNotFound';

import SongId from './components/songs/SongId'
import ArtistId from './components/artists/ArtistId'
import AlbumId from './components/albums/AlbumId'
import PlaylistId from './components/playlists/PlaylistId'
import UserId from './components/users/UserId'

function App(): JSX.Element {

  return (
    <div className="App">
      <RecoilRoot>
        <Router>
          <Navbar />
          <Header />
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/about" exact component={About} />
            <Route path="/song/:id" exact component={SongId} />
            <Route path="/artist/:id" exact component={ArtistId} />
            <Route path="/album/:id" exact component={AlbumId} />
            <Route path="/playlist/:id" exact component={PlaylistId} />
            <Route path="/user/:id" exact component={UserId} />
            <Route path='*' exact={true} component={GenericNotFound} />
          </Switch>
          <Footer />
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;
