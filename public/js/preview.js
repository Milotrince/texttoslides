const md = window.markdownit();

$(window).ready(event => {
    formatDefaultText()
    updatePreview()
})
$(window).resize(event => {
    updateTextSize()
})
$("#editor").on("input", () => {
    updatePreview()
})

function updatePreview() {
    updatePreviewContent();
    updateTextSize();
}


function formatDefaultText() {
  
    if ( $("#default-editor-text").length == 0 ) return
    let html = ""
    let split = $("#default-editor-text").text().split('\n')
    for (let text of split) {
        if (text.length == 0)
            html += `<div><br></div>`
        else
            html += `<div>${text}</div>`
    }
    $("#editor").html(html)
}

function updateTextSize() {
    $(".slide").each(function () {
        let fontSize = $(this).width() * 0.1
        $(this).css("fontSize", fontSize+"px")
    })
}

function updatePreviewContent() {
    let text = ""
    $("#editor").children().each(function () {
        text += $(this).text() + "\n"
    })
    let mdRender = md.render(text)

    let $slides = $(`<div></div>`)
    let $slide = $()
    let tag = ""
    $($.parseHTML(`<div>${mdRender}</div>`)).children().each(function() {
        tag = $(this).prop("tagName").toLowerCase()

        if (shouldStartNewSlide($(this))) {
            addCurrentSlide()
            $slide = $(`<div class="slide"></div>`)
        }

        switch (tag) {
            case "h1":
                getSlideTextArea("title").append(this)
                break
            case "h2":
                getSlideTextArea("subtitle").append(this)
                break
            case "hr":
                break
            default:
                getSlideTextArea("content").append(this)
                break
        }
    })
    addCurrentSlide()

    $("#preview").html($slides)

    $("#preview a").attr("target", "_blank");

    function getSlideTextArea(name) {
        let $search = $slide.children(`.${name}`)
        return $search.length > 0 ? $search : $slide.append(`<div class="text ${name}"></div>`).find(`.${name}`)
    }

    function shouldStartNewSlide($next) {
        let breaks = ["hr", "h1"]
        let maxChars = 700
        let totalChars = $slide.text().length + $next.text().length
        if (totalChars > maxChars) {
            // TODO: break content
        }
        return breaks.includes(tag) || totalChars > maxChars
    }

    function addCurrentSlide() {
        $slide.addClass(identifyLayout())
        $slides.append($slide.wrap(`<div class="slide-wrapper"></div>`).parent())
    }

    function identifyLayout() {
        let layout = "content-layout"
        let sections = []
        $slide.children().each(function() {
            sections.push($(this).attr("class").split(" ")[1])
        })

        let hasTitle = sections.includes("title")
        let hasSubtitle = sections.includes("subtitle")
        let hasContent = sections.includes("content")

        if (hasTitle && hasSubtitle && hasContent) {
            layout = "section-layout"
        } else if (hasSubtitle && hasContent) {
            
        } else if (sections.includes("title") && (sections.includes("subtitle") || !sections.includes("content") )) {
            layout = "title-layout"
        }

        return layout
    }

}
