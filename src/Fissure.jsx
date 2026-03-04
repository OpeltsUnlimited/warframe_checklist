import React, { useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';

function Fissures({model, totalRequired, wantedHasAmounts, setWantedHasAmounts}) {
    const [selectedFissure, setSelectedFissure] = useState(0);
    const [selectedRelics, setSelectedRelics] = useState([undefined,undefined,undefined,undefined]);

    const reliclist = model.data.relics

    var relicDiffs = []
    for (const r_type of Object.keys(reliclist)) {
        const div_key = `fissure_${r_type}`
        relicDiffs.push(
            <div className="nav-item" key={div_key}>
                <button className={selectedFissure == r_type ? "nav-link active" : "nav-link"}
                    onClick={() => { setSelectedFissure(r_type) }}>{r_type}</button>
            </div>
        )
    }

    return (
        <div width="100%">
            <div className="nav nav-tabs">
                {relicDiffs}
            </div>
            <div className='row'>
            <div className='col-8'>
            <Fissure selectedFissure={selectedFissure} reliclist={reliclist} model={model} totalRequired={totalRequired} wantedHasAmounts={wantedHasAmounts} 
            setWantedHasAmounts={setWantedHasAmounts} selectedRelics={selectedRelics} setSelectedRelics={setSelectedRelics}>

            </Fissure>
            </div>
            <div className='col-4'>
                <RelicsList selectedRelics={selectedRelics} setSelectedRelics={setSelectedRelics} reliclist={reliclist} model={model} totalRequired={totalRequired} wantedHasAmounts={wantedHasAmounts} setWantedHasAmounts={setWantedHasAmounts}>
                </RelicsList>
            </div>
            </div>
        </div>
    )
}

function relicColour(relic) {
        var buttonColor = "red"
        var buttonText = "white"

        if (relic.drops) {
            buttonColor = "green"
            buttonText = "white"
        } else if (relic.Varzia_e) {
            buttonColor = "lime"
            buttonText = "black"
        } else if (relic.Varzia_t) {
            buttonColor = "yellow"
            buttonText = "black"
        }

        return {buttonColor, buttonText}
}

function Fissure({selectedFissure, reliclist, model, totalRequired, wantedHasAmounts, setWantedHasAmounts, selectedRelics, setSelectedRelics}) {

    function relicSelected(relic) {
        var list = [...selectedRelics] // copy
        list.unshift({fissure: selectedFissure,relic: relic});
        list.length = 4;
        setSelectedRelics(list)
    }

    if (!selectedFissure) {
        return (<div></div>
        )
    }

    const rel_list = reliclist[selectedFissure]
    const neededRelics = new Set();

    for (const relname in rel_list) {
        const rel = rel_list[relname]
        var needed = false

        for (const reward of rel.rewards) {
            const reward_unique = model.nameToUnique[reward]
            const reward_needed = totalRequired[reward_unique]
            needed = needed || reward_needed>0
        }

        if (needed) {
            neededRelics.add(relname)
        }
    }

    const r_nameList = Object.keys(rel_list)
    var collator = new Intl.Collator([], { numeric: true });
    r_nameList.sort((a, b) => collator.compare(a, b));
    var relicDiffsLine = []
    var relicDiffs = []
    var lastLetter = undefined;

    for (const r_name of r_nameList) {
        const currentLetter = r_name[0]
        if (lastLetter && lastLetter != currentLetter) {
            const div_key = `line_${lastLetter}`
            relicDiffs.push(
                <tr key={div_key}>
                        {relicDiffsLine}
                </tr>
            )
            relicDiffsLine = []
        }
        lastLetter = currentLetter

        var buttonBorderColor = "grey"
        if ( neededRelics.has(r_name)) {
            buttonBorderColor = "orange"
        }

        const relic = rel_list[r_name]
        const {buttonColor, buttonText} = relicColour(relic)

        const buttonStyle = {
            color: buttonText,
            backgroundColor: buttonColor,
            border: `3px solid ${buttonBorderColor}`,   
        }
        
        const div_key = `line_${r_name}`
        relicDiffsLine.push(
            <td key={div_key}>
            <Button size="sm" style={buttonStyle}
            onClick={() => { relicSelected(r_name) }}>
                {r_name}
            </Button></td>
        )
    }
    const div_key = `line_${lastLetter}`
    relicDiffs.push(
        <tr key={div_key}>
            {relicDiffsLine}
        </tr>
    )

    return (
        <div >
        <div className='row'>
            <div className="col">
            <table>
                <tbody>
                    {relicDiffs}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    )
}

function RelicsList({selectedRelics, setSelectedRelics, reliclist, model, totalRequired, wantedHasAmounts, setWantedHasAmounts}) {
    console.log("asfda", selectedRelics)
    var selectedRelicview =[]
    for (const relic of selectedRelics) {
        selectedRelicview.push(selectedRelicRender(relic, reliclist, model, totalRequired, wantedHasAmounts, setWantedHasAmounts, selectedRelics, setSelectedRelics))
    }

    return (
            <div className="col">
                
                <Button onClick={() => {setSelectedRelics([undefined,undefined,undefined,undefined])}}>
                    Clear
                </Button>

                {selectedRelicview}
            </div>
    )
}

function selectedRelicRender(relic, reliclist, model, totalRequired, wantedHasAmounts, setWantedHasAmounts, selectedRelics, setSelectedRelics) {
    if (!relic) {
    return (
                <div className='row row-cols-2' style={{border: "1px solid black",margin: "2px"}}>
                    <div className="col">
                        ---
                    </div>
                    <div className="row row-cols-8">
                        <div className="col">---</div>
                        <div className="col">---</div>
                        <div className="col">---</div>
                        <div className="col">---</div>
                        <div className="col">---</div>
                        <div className="col">---</div>
                    </div>
                </div>
    )
    }

    function manupulateHave(uniqueName, value) {
        var wanted = {...wantedHasAmounts}

        var element = {...wanted[uniqueName]}
        element.has = Math.max(element.has + value, 0)
        wanted[uniqueName] = element

        setWantedHasAmounts(wanted)
    }


    const relicObject = reliclist[relic.fissure][relic.relic]
    const {buttonColor, buttonText} = relicColour(relicObject)
    const buttonStyle = {
        color: buttonText,
        backgroundColor: buttonColor,   
    }

    var rewadlist = []
    for (const reward of relicObject.rewards) {
        const reward_unique = model.nameToUnique[reward]
        const reward_needed = totalRequired[reward_unique]
        var color = "white"
        if (reward_needed > 0) {
            color = "orange"
        }
        if (reward_needed == undefined) {
            color = "yellow"
        }

        rewadlist.push(
        <div className='row'>
        <button className="col" style={{background: color}} onClick={() => {manupulateHave(reward_unique, 1)}}>{reward_needed} {reward}</button>
        <button className="col-1" style={{background: color}} onClick={() => {manupulateHave(reward_unique, -1)}}>-</button>
        </div>
        )
    }
    return (
                <div className='row' style={{border: "1px solid black",margin: "2px"}}>
                    <div className="col-8 span3">
                        <Button style={buttonStyle} onClick={() => {setSelectedRelics(selectedRelics.filter(item => item !== relic))}}>
                        </Button>
                        {relic.fissure} {relic.relic}
                    </div>
                    <div className='row row-cols-3' style={{border: "1px solid black",margin: "2px"}}>
                        {rewadlist}
                    </div>
                </div>
    )
}

export default Fissures;