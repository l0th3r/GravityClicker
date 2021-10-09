var GameData = {};

const Fetch = {
    MakeReq: function(url, successCallback, pendingCallback, failCallback) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            
            if(this.readyState === 4 && this.status === 200) {
                // success
                var parsedData = JSON.parse(this.response);

                if(successCallback)
                    successCallback(this.status, parsedData);
            }
            else if(this.readyState != 4) {
                // temp status
                if(pendingCallback)
                    pendingCallback(this.readyState);
            }
            else {
                // fail
                if(failCallback)
                    failCallback(this.status);
            }
        };

        xhttp.open("GET", url, true);
        xhttp.send();
    },
    FormatRequestAndSend: function(filters = [], datas = []) {
        
        // set filters parameters
        var str = "https://api.le-systeme-solaire.net/rest/bodies?";
        filters.forEach(f => {
            str += `filter[]=${f}&`
        });

        // set data parameters
        if(datas.length > 0)
            str += "data="
        datas.forEach(f => {
            str += `${f},`
        });

        return str.slice(0, -1);
    },
    GetJsonFile: function(localPath, successCallback, pendingCallback, failCallback) {
        this.MakeReq(localPath, (e, f)=>{GameData.settings = f; successCallback()}, pendingCallback, failCallback);
    },
    GetPlanets: function(successCallback, pendingCallback, failCallback) {

        const orderPlanets = (e) => {
            const sortedPlanets = e.sort((a, b) => a.aphelion - b.aphelion);
            GameData.planets = sortedPlanets;
            successCallback(sortedPlanets);
        }

        //format url with settings
        const url = this.FormatRequestAndSend([
            "isPlanet,neq,false", 
            "id,neq,ceres",
            "id,neq,eris",
            "id,neq,haumea",
            "id,neq,makemake",
            "id,neq,pluton"
        ], [
            "id",
            "englishName",
            "vol",
            "equaRadius",
            "sideralRotation",
            "discoveredBy",
            "rel",
            "aphelion"
        ]);

        // request
        this.MakeReq(url, (e, f)=>{orderPlanets(f.bodies)}, pendingCallback, failCallback);
    }
};

export { GameData, Fetch };