
$('[contenteditable]').on('paste', (event) => {
    event.preventDefault()
    let clipboard = event.originalEvent.clipboardData

    let text = clipboard.getData('text/plain')
    document.execCommand('inserttext', false, text)

    retrieveClipboardImageAsBase64(clipboard, (image) => {
        document.execCommand('insertImage', false, image)
    })

})

function onSubmit() {
    let text = $('#textdiv').html()
    text.replace('<b>', '<strong>')
    text.replace('</b>', '</strong>')
    text.replace('<i>', '<em>')
    text.replace('</i>', '</em>')
    $('#formtextarea').text(text)
    // $('#submitbutton').addClass('is-loading')
}

function retrieveClipboardImageAsBase64(clipboardData, callback, imageFormat){
    if (!clipboardData || !clipboardData.items) {
        if (typeof(callback) == "function") {
            callback(undefined)
        }
    }

    for (let item of clipboardData.items) {
        if (item.type.indexOf("image") == -1) continue

        let blob = item.getAsFile()
        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext('2d')
        let img = new Image()

        img.onload = function(){
            let area = this.width*this.height
            let maxarea = 800*800
            let scalar = area > maxarea ? maxarea/area : 1
            canvas.width = this.width * scalar
            canvas.height = this.height * scalar
            ctx.drawImage(img, 0, 0, this.width*scalar, this.height*scalar)
            if (typeof(callback) == "function"){
                callback(canvas.toDataURL(
                    (imageFormat || "image/png")
                ))
            }
        }

        let URLObj = window.URL || window.webkitURL
        img.src = URLObj.createObjectURL(blob)
    }
}