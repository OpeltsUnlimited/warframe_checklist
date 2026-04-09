import { writeFile} from 'node:fs/promises';
import { cacheFileIfOlderThan } from "./helper.js"
import { assert } from 'node:console';

function reduceFile(dataIn) {
    var data = {}

    var primedata = {}
    data["prime"] = primedata

    function checkIsPrime(el) {
        if (el.isPrime) {
            return true
        }
        // if a component has a "primeSellingPrice" the whole thing is probably prime ...
        return el?.components?.some(x => x?.primeSellingPrice !== undefined) ?? false;
    }

    const primes = dataIn.filter((el) => (checkIsPrime(el) & el.masterable == true))

    for (const prime of primes) {

        if (!prime?.components) // Sentinel weapons
            continue
            
        var componentsData = []
        for (const component of prime.components) {
            if (!component.drops[0]?.type) // base resources and orokin cells
                continue

            var guessCommonName = undefined
            if (component?.tags) // probably another Prime weapon
            {
                guessCommonName = component.name;
            } else {
                for (const drop of component.drops) {
                    if (guessCommonName) {
                        assert(guessCommonName == drop.type)
                    } else {
                        guessCommonName = drop.type // type in a relic drop seems to be the common name. unique name in a relic seems to be the name of the reilic
                    }
                }
            }

            componentsData.push({
                uniqueName: component.uniqueName.split("/").at(-1),
                itemCount: component.itemCount,
                name: guessCommonName
            })

        }

        const splitname = prime.uniqueName.split("/")
        primedata[prime.name] = {
            name: prime.name,
            uniqueName: splitname.at(-1),
            category: prime.category,
            components: componentsData
        }
        //components -> Drops?
    }
    


    const relics = dataIn.filter((el) => (el.category == "Relics"))
    var relicdata = {}
    data["relics"] = relicdata
    for (const relic of relics) {
        let r_type, r_name, r_quality;
        [r_type, r_name, r_quality] = relic.name.split(" ")

        if (r_quality != "Intact") { // only not upgraded for list
            continue
        }
        if (r_type == "Requiem" || r_type == "Vanguard" || r_type == "Void") {
            continue
        }

        var relicgroup = relicdata[r_type]
        if (!relicgroup) {
            relicgroup = {}
            relicdata[r_type] = relicgroup
        }

        var relicgroupnr = relicgroup[r_name]
        if (!relicgroupnr) {
            relicgroupnr = {
                uniqueName: relic.uniqueName.split("/").at(-1), // compare with varzia list

                drops: relic?.drops?.length > 0,//.map(loc => (loc.location)),

                rewards: relic.rewards.map(reward => (reward.item.name)),
            }
            relicgroup[r_name] = relicgroupnr
        }
    }

    //  "uniqueName": "/Lotus/Types/Game/Projections/T4VoidProjectionAtlasVaubanVaultABronze"
    // https://api.warframe.com/cdn/worldState.php
    // worldstate: "ItemType":"/Lotus/StoreItems/Types/Game/Projections/T4VoidProjectionAtlasVaubanVaultABronze","RegularPrice":1

    return data
}

function findBy(data, uniqueName) {
    var found = undefined

    var primedata = data["prime"]
    for (const primeName in primedata) {
        var prime = primedata[primeName]
        if (prime.uniqueName == uniqueName) {
            assert(found == undefined)
            found = prime
        }
    }

    var relicdata = data["relics"]

    for (const r_type in relicdata) {
        var relicgroup = relicdata[r_type]

        for (const r_name in relicgroup) {
            var relicgroupnr = relicgroup[r_name]

            if (relicgroupnr.uniqueName == uniqueName) {
                assert(found == undefined)
                found = relicgroupnr
            }
        }
    }
    return found
}

function addWorldstate(data, worldstate) {
    var nextExpity = undefined 
    for (const trader of worldstate.PrimeVaultTraders) {
        const expiry = trader.Expiry["$date"]["$numberLong"];
        if (expiry < nextExpity || !nextExpity) {
            nextExpity = expiry
        }

        for (const temp of trader.Manifest) {
            const uniqueName = temp.ItemType.split("/").at(-1)
            var found = findBy(data, uniqueName);
            if (found) {
                found.Varzia_t = true
            } else {
                //console.log("cant find", uniqueName)
            }
        }

        for (const ever of trader.EvergreenManifest) {
            const uniqueName = ever.ItemType.split("/").at(-1)
            found = findBy(data, uniqueName);
            if (found) {
                found.Varzia_e = true
            } else {
                //console.log("cant find", uniqueName)
            }
        }
    }
    return nextExpity
}

const jsonAll = await cacheFileIfOlderThan(1, "https://raw.githubusercontent.com/WFCD/warframe-items/refs/heads/master/data/json/All.json");
const reduced = reduceFile(jsonAll);
const worldstate = await cacheFileIfOlderThan(1, "https://api.warframe.com/cdn/worldState.php");
var nextExpity = addWorldstate(reduced, worldstate)

nextExpity = nextExpity / 1000 + 1*60*60 // expiry + 1hour grace for next build

await writeFile("public/data.json", JSON.stringify(reduced, null, 2));
await writeFile("nexttime.txt", String(nextExpity));

// curl https://origin.warframe.com/PublicExport/index_en.txt.lzma --output  test_cache/index_en.txt.lzma
//  xz -cd test_cache/index_en.txt.lzma > index_en.txt
// http://content.warframe.com/PublicExport/Manifest/ExportGear_en.json!00_0iyrvsyYgdfeHrkLL5-ELw
//  curl 'http://content.warframe.com/PublicExport/Manifest/ExportGear_en.json!00_0iyrvsyYgdfeHrkLL5-ELw'