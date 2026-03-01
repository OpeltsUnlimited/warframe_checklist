import React, { useState, useEffect, useMemo } from 'react';
import { Button, Stack, Nav } from 'react-bootstrap';
import './App.css'
import Fissures from './Fissure.jsx'
import PrimeItems from './PrimeItems.jsx'

import MainModell from './MainModell.jsx'

var m = new MainModell()

function App() {

  const AppState = Object.freeze({
    Init: 0,
    Loading: 1,
    Interpreting: 2,
    Finished: 3,
  });

  const TabState = Object.freeze({
    Item: 0,
    Fissure: 1,
  });

  const [appState, setAppState] = useState(AppState.Init);
  const [mainTab, setMainTab] = useState(TabState.Item);
  const [wantedHasAmounts, setWantedHasAmounts] = useState({});

  useEffect(() => {
    if (Object.keys(wantedHasAmounts).length === 0) {
      return
    }
    const wantHas =Object.fromEntries(Object.entries(wantedHasAmounts).map(([key, value]) => [key, value.has]))
    localStorage.setItem('wantedHasAmounts', JSON.stringify(wantHas));
  }, [wantedHasAmounts])

  const initApp = async () => {
    switch (appState) {
      case AppState.Init:
        setAppState(appState + 1);
        return
      case AppState.Loading:
        await m.load();
        setAppState(appState + 1)
        return
      case AppState.Interpreting: {
        const initialNeed = await m.interpret()
        setWantedHasAmounts(initialNeed)
        setAppState(appState + 1)
      }
        return
    }
  };

  useEffect(() => {
    initApp();
  }, [appState]);


  const totalRequired = useMemo(() => {
    const totals = {};

    // recursive Calc
    const calculate = (id, amount) => {
      totals[id] = (totals[id] || 0) + amount;
      if (amount == 0) {
        return
      }
      const recipe = m.needed_Formula[id];
      if (!recipe) {
        return
      }
      for (const recepyLineId of Object.keys(recipe)) {
        const resNeed = recipe[recepyLineId]
        calculate(recepyLineId, resNeed * amount)
      }

    };

    for (const wantedName of Object.keys(wantedHasAmounts)){
      const wanted = wantedHasAmounts[wantedName]
      const wantToNeed = wanted.need - wanted.has
      calculate(wantedName, wantToNeed)
    }

    return totals;
  }, [wantedHasAmounts]);

  switch (appState) {
    case AppState.Init:
      return (
        <div className="App">
          <div className="navbar bg-dark text-white p-2 ">
            <a className="navbar-brand text-white" href="#">
              <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo" width="30" height="30" className="d-inline-block align-top" />
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
          <div className="navbar bg-dark text-white p-2 ">
            <a className="navbar-brand text-white" href="#">
              <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo" width="30" height="30" className="d-inline-block align-top" />
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
          <div className="navbar bg-dark text-white p-2 ">
            <a className="navbar-brand text-white" href="#">
              <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo" width="30" height="30" className="d-inline-block align-top" />
              Checklist V0!
            </a>
          </div>
          <div className="container list-group mt-3">
            Interpreting
          </div>
        </div>
      )

    case AppState.Finished:
      switch(mainTab) {
        case TabState.Item:
          return (
            <div className="App">
              <div className="navbar bg-dark text-white p-2 ">
                <a className="navbar-brand text-white" href="#">
                  <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo" width="30" height="30" className="d-inline-block align-top" />
                  Checklist V0.1!
                </a>
              </div>
              <div className="nav nav-tabs">
                <div className="nav-item">
                    <button className="nav-link active"
                        onClick={() => { setMainTab(TabState.Item) }}>Item</button>
                </div>
                <div className="nav-item">
                    <button className="nav-link"
                        onClick={() => { setMainTab(TabState.Fissure) }}>Fissure</button>
                </div>
              </div>

              <PrimeItems model={m} totalRequired={totalRequired} wantedHasAmounts={wantedHasAmounts} setWantedHasAmounts={setWantedHasAmounts}>

              </PrimeItems>

            </div>
          )
        case TabState.Fissure:
          return (
            <div className="App">
              <div className="navbar bg-dark text-white p-2 ">
                <a className="navbar-brand text-white" href="#">
                  <img src="https://github.com/WFCD/warframe-items/blob/master/data/img/clan-sigil-b17cd6bed0.png?raw=true" alt="logo" width="30" height="30" className="d-inline-block align-top" />
                  Checklist V0.1!
                </a>
              </div>
              <div className="nav nav-tabs">
                <div className="nav-item">
                    <button className="nav-link"
                        onClick={() => { setMainTab(TabState.Item) }}>Item</button>
                </div>
                <div className="nav-item">
                    <button className="nav-link active"
                        onClick={() => { setMainTab(TabState.Fissure) }}>Fissure</button>
                </div>
              </div>

              <Fissures model={m} totalRequired={totalRequired} wantedHasAmounts={wantedHasAmounts} setWantedHasAmounts={setWantedHasAmounts}>

              </Fissures>
            </div>
          )
    }
  }
}

export default App;