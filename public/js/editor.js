let importHelpText = ""
let themes = ["chic", "elegant"]

$(document).ready(() => {
    importHelpText = $("#importhelp").text()

    for (let theme of themes) {
        $("#theme").append(`<option value=${theme}>${theme}</option>`)
    }

    let texthtml = $("#texthtml").text()
    if (texthtml) {
        $("#editor").html(texthtml)
    }

    setSlidesTheme(localStorage.getItem("slidetheme") || "default")
})

function setSlidesTheme(theme) {
    $("#theme").val(theme)
    $("#preview").attr("class", `theme-${theme}`)
    localStorage.setItem("slidetheme", theme);
}

$("#theme").change(function() {
    setSlidesTheme($(this).val())
})

$("[contenteditable]").on("paste", (event) => {
    event.preventDefault()
    let clipboard = event.originalEvent.clipboardData
    let text = clipboard.getData("text/plain")
    document.execCommand("inserttext", false, text)
})


$("#import-button").on("click", (e) => {
    let url = $("#link").val()
    let $help = $("#importhelp")
    if (!isValidURL(url)) {
        $help.text("Needs to be valid URL")
        $help.addClass("has-text-danger")
        return false
    } else {
        $help.text(importHelpText)
        $help.removeClass("has-text-danger")
    }

    $.post("/linkimport", { link: url })
        .done(data => {
            $("#editor").html(data.html)
            updatePreview()
        })
})

$("#download-button").on("click", (e) => {
    let pptxTitle = $(".text.title").first().text()
    let pptx = new PptxGenJS()
    pptx.layout = "LAYOUT_4x3"
    pptx.title = pptxTitle
    pptx.subject = "made with texttoslides"
    pptx.author = ""
    pptx.company = ""

    $(".slide-wrapper").each(function () {
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
    
    pptx.writeFile(`${pptxTitle.replace(/[^0-9a-zA-Z]+/g, "")}.pptx`)
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
                    case "p":
                        options.breakLine = true
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
        paraSpaceAfter: $e.css("margin-bottom"),
        fontSize: getEm($e, "font-size", "width")*96*7.5, // 96 px/inch, slide width 7.5in
        fontFace: $e.css("font-family"),
        align: $e.css("text-align").replace("start", "").replace("end", "right"),
        valign: $e.css("align-items").replace("normal", "top").replace("flex-end", "bottom"),
        color: rgbToHex($e.css("color")),
        fill: fill
    }

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