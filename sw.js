self.addEventListener("install",(event)=>{
    console.log("installed !!!!!");
    self.skipWaiting()
    event.waitUntil(
        caches.open("our-app").then((cache)=> cache.addAll(["/","index.html","styles/index.css","js/main.js","other.html","styles/other.css","js/other.js"]))
    )
})

self.addEventListener("activate",()=>{
    console.log("activated");
    
})


self.addEventListener("fetch",(event)=>{
    console.log("send req to ",event.request.url);
    event.respondWith(
        // cache first
        caches.match(event.request.url).then((file)=>{
            if(file){
                console.log("file found in cache");
                return file
            }
            else{
                console.log("file Not found in cache");
               return fetch(event.request.url)
            }
        })
    )
})