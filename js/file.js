import { HandleSaveFileLoad } from './userdata';

function OutputFile(filename, content) {
    var file = new Blob([content], {type: "type"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }     
}

function TriggerInputSaveFile() {
    document.getElementById('file-input').click();
}

const fileInput = document.getElementById('file-input');
fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];
    
    var reader = new FileReader();
    reader.readAsText(selectedFile, "UTF-8");
    reader.onload = function (evt) {
        HandleSaveFileLoad(evt.target.result);
    }
}

export { OutputFile, TriggerInputSaveFile };