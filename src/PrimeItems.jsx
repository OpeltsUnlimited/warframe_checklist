import React, { useState} from 'react';
import { Button } from 'react-bootstrap';

function PrimeItems({model, totalRequired, wantedHasAmounts, setWantedHasAmounts}){
    const [filter, setFilter] = useState(undefined);
    const primeDict = model.data?.prime

    const variants = [...new Set(Object.values(primeDict).map(obj => obj.category))];

    var filterDifs = []

    filterDifs.push(
        <div className="nav-item" key="All">
            <button className={filter == undefined ? "nav-link active" : "nav-link"}
                onClick={() => { setFilter(undefined) }}>All</button>
        </div>
    )
    for (const filt of variants) {
        filterDifs.push(
            <div className="nav-item" key={filt}>
                <button className={filter == filt ? "nav-link active" : "nav-link"}
                    onClick={() => { setFilter(filt) }}>{filt}</button>
            </div>
        )
    }

    return (
        <div>
            <div className="nav nav-tabs">
                {filterDifs}
            </div>
            <div>
                <ItemsList primeDict={primeDict} filter={filter} totalRequired={totalRequired} wantedHasAmounts={wantedHasAmounts} setWantedHasAmounts={setWantedHasAmounts} model={model}>

                </ItemsList>
            </div>
        </div>
    )
}

function ItemsList({primeDict, filter, totalRequired, wantedHasAmounts, setWantedHasAmounts, model}) {

    var list = []
    for (const primeName of Object.keys(primeDict)) {
        const prime = primeDict[primeName]
        if (!filter || prime.category == filter) {
            list.push(
                <ItemsShow itemObject={prime} totalRequired={totalRequired} wantedHasAmounts={wantedHasAmounts} setWantedHasAmounts={setWantedHasAmounts} model={model}>

                </ItemsShow>
            )
        }
    }

    return (
        <div>
            {list}
        </div>
    )
}

function ItemsShow({itemObject, totalRequired, wantedHasAmounts, setWantedHasAmounts, model}) {

    const needHas = wantedHasAmounts[itemObject.uniqueName]

    var color = "white"
    if (needHas.need > needHas.has) {
        color = "orange"
    }

    function manupulateHave(uniqueName, value) {
        var wanted = {...wantedHasAmounts}

        var element = {...wanted[uniqueName]}
        element.has = Math.max(element.has + value, 0)
        wanted[uniqueName] = element

        setWantedHasAmounts(wanted)
    }

    function canBuild(uniqueName) {
        const recipe = model.needed_Formula[uniqueName];
        if (!recipe) {
            return false
        }
        for (const recepyLineId of Object.keys(recipe)) {
            const resNeed = recipe[recepyLineId]
            const has = wantedHasAmounts[recepyLineId].has
            if (resNeed > has) {
                return false
            }
        }
        return true
    }

    function build(uniqueName) {
        if (!canBuild(uniqueName)) {
            return
        }

        const recipe = model.needed_Formula[uniqueName];
        if (!recipe) {
            return false
        }

        var element
        var wanted = {...wantedHasAmounts}
        for (const recepyLineId of Object.keys(recipe)) {
            const resNeed = recipe[recepyLineId]

            element = {...wanted[recepyLineId]}
            element.has = Math.max(element.has - resNeed, 0)
            wanted[recepyLineId] = element

        }
        
        element = {...wanted[uniqueName]}
        element.has = Math.max(element.has + 1, 0)
        wanted[uniqueName] = element
        setWantedHasAmounts(wanted)
    }
        
    return (
        <div className='row'>
            <div className='col-1' style={{background: color}}>
                {itemObject.name}
            </div>
            <div className='col-1'>
                <Button className="col" disabled={!canBuild(itemObject.uniqueName)} onClick={() => {build(itemObject.uniqueName)}}>Build</Button>
            </div>
            <div className='col-1'>
                <button className="col" onClick={() => {manupulateHave(itemObject.uniqueName, 1)}}>+</button>
            </div>
            <div className='col-1'>
                <button className="col-1" onClick={() => {manupulateHave(itemObject.uniqueName, -1)}}>-</button>
            </div>
            <div className='col-1'>
                {totalRequired[itemObject.uniqueName]}
            </div>
        </div>
    )
}

export default PrimeItems;