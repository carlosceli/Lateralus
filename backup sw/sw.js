


//console.log (“Estamos desde el service worker”);

//obtener informacion general de las peticiones fetch
/*
self.addEventListener("fetch", event=> {
     console.log(event);
});
*/

//mostrar url de los archivos
/*
self.addEventListener("fetch", event=> {
     console.log(event.request.url);
});
*/
// mostrar url de archivos css
/*
self.addEventListener("fetch", event=> {
     console.log(event.request.url.includes("css"));
});
*/

//mostrar url de las imagenes
/*
self.addEventListener("fetch", event=> {
     if (event.request.url.includes("jpg")){
	     console.log(event.request.url)

     }
});
*/


//cuando queremos bloquear un elemento
/*self.addEventListener('fetch', event=> {

     if (event.request.url.includes("style.css")){

          event.respondWith(null);
     }else{
          event.respondWith(fetch(event.request));
     }
});
*/
//bloquear una imagen
/*
self.addEventListener("fetch", event=> {
     if (event.request.url.includes("jpg")){
	     event.respondWith(null);
     }else{
	     event.respondWith(fetch(event.request));
     }
});
*/

/*
//cambiar una imagen por otra
self.addEventListener('fetch', event=> {

     if (event.request.url.includes("main.jpg")){
     	let imagenreq=fetch('img/main-patas-arriba.jpg');
	     event.respondWith(imagenreq);
     }else{
	     event.respondWith(fetch(event.request));
     }
});
*/

/*
//cambiar una hoja de stylo por otra
self.addEventListener('fetch', event=> {

     if (event.request.url.includes("style.css")){
          let imagenreq=fetch('css/copia_style.css');
          event.respondWith(imagenreq);
     }else{
          event.respondWith(fetch(event.request));
     }
});
*/

/*
//formas de obtener datos de una imagen con fetch:
//forma 1
self.addEventListener('fetch', event=> {

     if (event.request.url.includes("jpg")){
     	let imagenreq=fetch(event.request.url);
	     event.respondWith(imagenreq);
     }else{
	     event.respondWith(fetch(event.request));
     }
});
*/

/*
//forma 2

self.addEventListener('fetch', event=> {

     if (event.request.url.includes("jpg")){
     	let imagenreq=fetch(event.request);
	     event.respondWith(imagenreq);
     }else{
	     event.respondWith(fetch(event.request));
     }
});
*/

/*
//forma 3
self.addEventListener('fetch', event=> {

     if (event.request.url.includes("jpg")){
     	let imagenreq=fetch(event.request);
	     event.respondWith(imagenreq);
     }else{
	     event.respondWith(fetch(event.request));
     }
});
*/

/*
//interceptar un elemento y ver si existe
self.addEventListener('fetch', event=> {

     const resp=fetch  (event.request)
     .then(resp=>{

	   return resp.ok ? resp:fetch ('img/main.jpg');
     });
	     event.respondWith(resp);
});
*/




//1. instalacion
/*
self.addEventListener('install', event=>{

    console.log("instalando service worker");
    self.skipWaiting();
})
*/


//3. event.waitUntil( )
self.addEventListener('install', event => {


    console.log('SW: Instalando SW');

    const instalacion = new Promise( (resolve, reject) => {

        setTimeout(() => {
            console.log('SW: Instalaciones terminadas');
            self.skipWaiting();
            resolve();
        }, 1);

    });
    event.waitUntil( instalacion );
});


//2. cuando el service worker se activa o tome el control de la aplicación.


self.addEventListener('activate', event=>{

    console.log("el service worker está activo y listo para tomar el control de la aplicacion");
})

//4.  FETCH: Manejo de peticiones HTTP
/*
self.addEventListener('fetch', event => {

    // Aplicar estrategias del cache
     console.log( 'SW:', event.request.url );

     if ( event.request.url.includes('https://reqres.in/') ) {

         const resp = new Response(`{ ok: false, mensaje: 'jajaja'}`);

         event.respondWith( resp );

     }

});
*/

// 5. SYNC: Recuperamos la conexión a internet
/*
self.addEventListener('sync', event => {

    console.log('Tenemos conexión!');
    console.log(event);
    console.log(event.tag);

});
*/
// 6. PUSH: Manejar las push notifications

self.addEventListener('push', event => {

    console.log('Notificacion recibida ok...');


});

