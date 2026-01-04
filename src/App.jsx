import React, { useState, useEffect } from 'react';
import './App.css'

import MainModell from './MainModell.jsx'

var m = new MainModell()

function App() { 
  
  const AppState = Object.freeze({
      Init:   0,
      Loading:   1,
      Finished: 2,
  });

  const [appState, setAppState] = useState(AppState.Init);

   const initApp = async () => {
    console.log("initApp", appState)
    switch (appState) {
      case AppState.Init:
        setAppState(appState + 1);
        return
      case AppState.Loading:
        await m.load();
        setAppState(appState + 1)
        return
  }
  };

  useEffect(() => {
    initApp();
  }, [appState]);


  switch(appState) {
  case AppState.Init:
    return (
    <div className="App">
      <div  className="navbar bg-dark text-white p-2 ">
        <a className="navbar-brand text-white" href="#">
          <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo"  width="30" height="30" className="d-inline-block align-top"/> 
          Checklist V0!
        </a>
      </div>
      <div className="container list-group mt-3">
            INIT
      </div>
    </div>
    
    )
  case AppState.Loading:
    return (
    <div className="App">
      <div  className="navbar bg-dark text-white p-2 ">
        <a className="navbar-brand text-white" href="#">
          <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo"  width="30" height="30" className="d-inline-block align-top"/> 
          Checklist V0!
        </a>
      </div>
      <div className="container list-group mt-3">
            LOADING
      </div>
    </div>
    
    )
  case AppState.Finished:
    return (
    <div className="App">
      <div  className="navbar bg-dark text-white p-2 ">
        <a className="navbar-brand text-white" href="#">
          <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo"  width="30" height="30" className="d-inline-block align-top"/> 
          Checklist V0!
        </a>
      </div>
      <div>A<pre>{JSON.stringify(m.data, null, 2) }</pre>A</div>
    </div>
    )
  }
}

export default App;