let grabHelpText = ""
let themes = ["fancy", "whimsical"]

$(document).ready(() => {
    grabHelpText = $("#grabhelp").text()

    for (let theme of themes) {
        $("#theme").append(`<option value=${theme}>${theme}</option>`)
    }

    let texthtml = $("#texthtml").text()
    if (texthtml) {
        $("#editor").html(texthtml)
    }
})

$("#theme").change(function() {
    $("#preview").attr("class", `theme-${$(this).val()}`)
})

$("[contenteditable]").on("paste", (event) => {
    event.preventDefault()
    let clipboard = event.originalEvent.clipboardData

    let text = clipboard.getData("text/plain")
    document.execCommand("inserttext", false, text)

    retrieveClipboardImageAsBase64(clipboard, (image) => {
        document.execCommand("insertImage", false, image)
    })
})


$("#grab-button").on("click", (e) => {
    let url = $("#link").val()
    let $help = $("#grabhelp")
    if (!isValidURL(url)) {
        $help.text("Needs to be valid URL")
        $help.addClass("has-text-danger")
        return false
    } else {
        $help.text(grabHelpText)
        $help.removeClass("has-text-danger")
    }

    // TODO: Need to use cookies to show loading/done loading
    // $("#grab-button").addClass("is-loading")
    $.post("/grab", { link: url })
        .done(data => {
            $("#editor").html(data.html)
            // $("#grab-button").removeCLass("is-loading")
        })
})

$("#download-button").on("click", (e) => {
    let pptx = new PptxGenJS()
    pptx.layout = "LAYOUT_4x3"

    $('.slide-wrapper').each(function () {
        let slide = pptx.addSlide()

        // slide
        $(this).children().each(function () {

            let slideBg = { fill: rgbToHex($(this).css("background-color")) }
            let bgImage = $(this).css("background-image")
            if (bgImage.startsWith("url(")) {
                slideBg.path = bgImage.substring(5, bgImage.length-2).replace(".svg", ".png")
            }
            slide.background = slideBg

            // slide section
            $(this).children().each(function () {
                if ($(this).hasClass("text")) {
                    // text element
                    slide.addText( getText($(this)), getTextProperties($(this), $(this).parent()) )
                }
            })
        })
    })
    
    pptx.writeFile()
})


function getText($e) {

    let textList = []
    recursive($e)
    return textList

    function recursive($e, tags = []) {
        let tag = $e.prop("tagName").toLowerCase()
        tags.push(tag)

        if ($e.children().length > 0) {
            $e.children().each(function() {
                return recursive($(this), tags)
            })
        } else {
            let options = {}
            for (let tag of tags) {
                switch (tag) {
                    case "a":
                        options.hyperlink = {url: $e.attr("href")}
                        break
                    case "b":
                    case "strong":
                        options.bold = true
                        break
                    case "i":
                    case "em":
                        options.italic = true
                        break
                    case "li":
                        let parentTag = $e.parent().prop("tagName").toLowerCase()
                        options.bullet = parentTag === "ol" ? {type: "number"} : true
                        break
                }
            }
            textList.push({ text: $e.text(), options: options })
            return $e
        }

    }
}

function getTextProperties($e, $parent) {

    let offset = {
        top: ($e.offset().top - $parent.offset().top) / $parent.height(),
        left: ($e.offset().left - $parent.offset().left ) / $parent.width()
    }
    let size = {
        width: $e.width() / $parent.width(),
        height: $e.height() / $parent.height(),
    }
    let rgbaSplit = $e.css("background-color").split(",")
    let fill = rgbaSplit.length === 4 ? "" : rgbToHex($e.css("background-color"))

    let props = {
        x: offset.left*100+"%",
        y: offset.top*100+"%",
        w: size.width*100+"%",
        h: size.height*100+"%",
        fontSize: getEm($e, "font-size", "width")*96*7.5, // 96 px/inch, slide width 7.5in
        fontFace: $e.css("font-family"),
        align: $e.css("text-align").replace("start", "").replace("end", "right"),
        valign: $e.css("align-items").replace("normal", "top").replace("flex-end", "bottom"),
        color: rgbToHex($e.css("color")),
        fill: fill
    }

    // console.log(props)

    return props

    function getEm($e, prop, parentProp) {
        let c = getCssNumber($e, prop)
        let p = getCssNumber($e.parent().parent(), (parentProp))
        return Math.round(c / p * 100) / 100
    }
    function getCssNumber($e, prop) {
        return parseFloat( $e.css(prop).replace( /[^0-9.]/g, "") )
    }
}



function rgbToHex(rgb) {
    if (  rgb.search("rgb") == -1 ) {
        return rgb;
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
    }
}

function isValidURL(str) {
    var pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+ // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))"+ // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+ // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?"+ // query string
      "(\\#[-a-z\\d_]*)?$","i"); // fragment locator
    return !!pattern.test(str);
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
        let ctx = canvas.getContext("2d")
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