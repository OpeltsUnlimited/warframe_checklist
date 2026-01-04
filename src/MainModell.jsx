import js from "@eslint/js";

class MainModell {
    constructor() {
        this.data = 0

        this.objects = new Map() // unique_name / object
        this.categorys = new Map() // Map(category, Map(type, List(object, Refference)))
    }
    
    async load() {
        try {
            var response = await fetch("https://raw.githubusercontent.com/WFCD/warframe-items/refs/heads/master/data/json/All.json");
            this.data = await response.json();
        } catch (e) {
            console.log('Error', e);
        }
    }
    
    async interpret() {
        for(var i = 0; i < this.data.length; i++) {
            const j = this.data[i]
            const cat = j["category"]
            const typ = j["type"]
            const uniqueName = j["uniqueName"]

            var obj = new Map()
            obj["category"] = cat
            obj["type"] = typ
            obj["name"] = j["name"]

            if (!this.categorys.has(cat) ) {
                this.categorys.set(cat, new Map());
            }
            var map_cat = this.categorys.get(cat)

            if (!map_cat.has(typ) ) {
                map_cat.set(typ, new Array());
            }
            var map_typ = map_cat.get(typ)
            map_typ.push(obj)

            this.objects.set(uniqueName, obj)
        }
    }
}

  
export default MainModell;