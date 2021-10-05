var Data = [];

const Fetch = {
    MakeReq: function(url, successCallback, pendingCallback, failCallback) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            
            if(this.readyState === 4 && this.status === 200) {
                // success
                Data = JSON.parse(this.response).bodies;
                successCallback(this.status);
            }
            else if(this.readyState != 4) {
                // temp status
                pendingCallback(this.readyState);
            }
            else {
                // fail
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
    GetPlanets: function(successCallback, pendingCallback, failCallback) {
        
        //format url with settings
        const url = this.FormatRequestAndSend([
            "isPlanet,neq,false", 
            "id,neq,ceres",
            "id,neq,eris",
            "id,neq,haumea",
            "id,neq,makemake"
        ], [
            "id",
            "englishName",
            "vol",
            "equaRadius",
            "sideralRotation",
            "discoveredBy",
            "rel"
        ]);

        // request
        this.MakeReq(url, successCallback, pendingCallback, failCallback);
    }
};

export { Data, Fetch };