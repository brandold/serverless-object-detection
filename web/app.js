const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


const allowedExtentions = ['jpg', 'jpeg', 'png']

$(document).ready(function () {
    $('#img-upload-form').submit(async function (e) {
        e.preventDefault();
        $('#returnedImg').attr("src", '')
        $('#returnedJson').text('')
        var img = $('#customFile')[0].files[0]
        var arr_buff = await toBase64(img)
        
        var returnImage = null
        var overlay = document.getElementById("overlayCheck")
        if (overlay.checked) {
            returnImage = true
        }
        else {
            returnImage = false
        }

        var name = img.name

        var type = name.split('.').pop()

        if (!allowedExtentions.includes(type)) {
            alert('Unsupported file type')
            return false;
        } 

        var data = arr_buff;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var data = this.responseText
                var jsonResponse = JSON.parse(data)
                if (returnImage == true) {
                    var b64Header = 'data:image/jpeg;base64,'
                    var b64Img = b64Header + jsonResponse.image
                    $('#returnedImg').attr("src", b64Img)
                }
                else {
                    console.log(jsonResponse)
                    $('#returnedJson').text(JSON.stringify(jsonResponse))
                }
            }
        });
        
        var replaceMe = "https://$$$$$$$.execute-api.us-west-2.amazonaws.com/api/"

        var url = replaceMe + "detectObjects?returnImage=" + returnImage

        xhr.open("POST", url);
        if (type == 'png') {
            xhr.setRequestHeader("Content-Type", "image/png");
        }
        else {
            xhr.setRequestHeader("Content-Type", "image/jpeg");
        }

        xhr.send(data);
    });
});