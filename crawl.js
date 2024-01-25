const { JSDOM } = require('jsdom')
const { print } = require('./print.js')

function normalizeURL(url){
    if (url[url.length-1]==='/'){
        return url.slice(url.indexOf('/')+2, url.length-1)
    }
    return url.slice(url.indexOf('/')+2)
}

function getURLfromHTML(htmlBody, baseURL){
    const dom  = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll("a")
    const hrefAttributes = Array.from(links).map(link => link.href);
    return hrefAttributes.toString().split(',')
}
function updatePages(pages, newPages){
    print(newPages)
    for (const [key, value] of Object.entries(newPages)){
        pages[key] += value
    }
}

async function crawlPage(baseURL, currentURL, pages){
    const normURL = normalizeURL(currentURL)
    if (!(normURL.startsWith(normalizeURL(baseURL)))){
        return pages}
    
    if (!(normURL in pages)){
        pages[normURL] = 1}
    else{
        return pages
    }
    
    
    print(normURL)
    const response = await fetch(currentURL)
    const html = await response.text()
    const allURLs = await getURLfromHTML(html)
    
    for (let url of allURLs){
        if (url[0] === '/' && url.length > 2){
            url =`${baseURL}${url}`}
        pages = await crawlPage(baseURL, url, pages)
        
    }   
    return pages
}  

module.exports = {
    normalizeURL,
    getURLfromHTML,
    crawlPage
  }
