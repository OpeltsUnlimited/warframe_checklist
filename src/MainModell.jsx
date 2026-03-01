class MainModell {
    constructor() {
        this.data = undefined
        this.nameToUnique = {}
        this.needed_Formula = {} // unique_name / object
    }
    
    async load() {
        try {
            var response = await fetch("data.json");
            this.data = await response.json();
            console.log('Load OK')
        } catch (e) {
            console.log('Error', e);
        }
    }
    
    async interpret() {
        const wantedHasAmounts = JSON.parse(localStorage.getItem('wantedHasAmounts'));

        var initialNeed = {}
        for (const primeName of Object.keys(this.data.prime)) {
            const prime = this.data.prime[primeName]
            this.nameToUnique[primeName] = prime.uniqueName

            const tempHas = wantedHasAmounts[prime.uniqueName] || 0

            initialNeed[prime.uniqueName] = {need:1, has:tempHas}

            var needed_dict = {}
            for (const component of prime.components) {
                var comt_entry = needed_dict[component.uniqueName]
                if (!comt_entry) {
                    comt_entry = 0
                }
                const tempHas = wantedHasAmounts[prime.uniqueName] || 0
                initialNeed[component.uniqueName] = {need:0, has:tempHas}
                needed_dict[component.uniqueName] = comt_entry + component.itemCount
                this.nameToUnique[component.name] = component.uniqueName
            }

            this.needed_Formula[prime.uniqueName] = needed_dict
        }
        return initialNeed
    }
}

  
export default MainModell;