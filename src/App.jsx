import React, { useState, useEffect } from 'react';
import { Button, Stack, Nav} from 'react-bootstrap';
import './App.css'

import MainModell from './MainModell.jsx'

var m = new MainModell()

function App() { 

  const AppState = Object.freeze({
      Init:   0,
      Loading:   1,
      Interpreting: 2,
      Finished: 3,
  });

  const [appState, setAppState] = useState(AppState.Init);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedType, setSelectedType] = useState(0);

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
      case AppState.Interpreting:
        await m.interpret();
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
    
  case AppState.Interpreting:
    return (
    <div className="App">
      <div  className="navbar bg-dark text-white p-2 ">
        <a className="navbar-brand text-white" href="#">
          <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo"  width="30" height="30" className="d-inline-block align-top"/> 
          Checklist V0!
        </a>
      </div>
      <div className="container list-group mt-3">
            Interpreting
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
      <Stack direction="horizontal" className="align-items-start">
      <div className="flex-column list-group mt-3">
        {Array.from(m.categorys).map(([key, value]) => (
          <Button 
          variant={selectedCategory == value ? 'primary' : 'outline-primary'}
          onClick={() => {setSelectedCategory(value)
          setSelectedType(0)}}>
            {key}
          </Button>
        ))}
        </div>
      <div className="flex-column list-group mt-3">
        {Array.from(selectedCategory).map(([key, value]) => (
          <Button 
          variant={selectedType == value ? 'primary' : 'outline-primary'}
          onClick={() =>setSelectedType(value)}>
            {key}
          </Button>
        ))}
        </div>
        <div className="flex-column list-group mt-3">
          { !selectedType ? null : selectedType.map((value) => (
            <div>{value["name"]}</div>
          ))
          }
        </div>
      </Stack>
    </div>
    )
  }
}

export default App;