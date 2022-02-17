export default function stripTextFromHtml(html){
    return html?.replace(/(<([^>]+)>)/gi, "").trim()
}
