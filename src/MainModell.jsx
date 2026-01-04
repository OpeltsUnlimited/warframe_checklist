import js from "@eslint/js";

class MainModell {
    constructor() {
        this.data = 0
    }
    
    async load() {
        try {
            var response = await fetch("https://raw.githubusercontent.com/WFCD/warframe-items/refs/heads/master/data/json/All.json");
            this.data = await response.json();

            const categorys =  new Set();
            const types =  new Set();
            const tree = {}

            var tst = 0;
            for(var i = 0; i < this.data.length; i++) {
                const j = this.data[i]
                const cat = j["category"]
                const typ = j["type"]
                categorys.add(cat)
                types.add(typ)

                var tree_elem = tree[cat]
                if (!tree_elem) {
                    tree_elem = new Set()
                    tree[cat] = tree_elem
                }
                tree_elem.add(typ)
                tst ++;
            }
            console.log("tst", tst);
            console.log("Cat", categorys);
            console.log("Typ", types);
            console.log("tree", tree);
            console.log("data", this.data);
            

        } catch (e) {
            console.log('Booo', e);
        }
    }
}
  
export default MainModell;