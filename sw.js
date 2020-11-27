//nuevo cache dinamico
importScripts('js/libs/sw-utils.js');

const DYNAMIC_CACHE='dynamic-v1';
const INMUTABLE_CACHE='inmutable-v1';
const STATIC_CACHE='static-v1';

const APP_SHELL=[
    // '/',
    '/index.html',
    '/index2.html',
    '/services.html',
    '/shop.html',
    '/pcbuild.html',
    '/shop_cart.html',
    '/contact.html',
    '/css/style.css',
    '/js/app.js',
    '/crud1_index.html',
    '/crud1_show.html',
    '/crud1_create.html',
    '/jqCrud_create.html',
    '/jqCrud_show.html',
    '/offline/offline.html',
    'js/libs/sw-utils.js'
];

const APP_SHELL_INMUTABLE=[
    '/css/bootstrap.min.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e=>{

    const cacheStatic=caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));

    const cacheInmutable=caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic , cacheInmutable]));
});

self.addEventListener('activate', e=>{

    const respuesta= caches.keys().then(keys=>{
        keys.forEach(key=>{
            if(key!== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});


self.addEventListener('fetch', e=>{
    const respuesta= caches.match(e.request).then(res=>{

        if (res){
            return res;
        }else{
            return fetch(e.request).then(newRes=>{
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

            });
        }
    });
    e.respondWith(respuesta);
});






//3 3.	Guardar el APP SHELL a la hora de instalar el SW 

/*
const CACHE_STATIC_NAME='static-v4';
const CACHE_DYNAMIC_NAME='dynamic-v1';
const CACHE_INMUTABLE_NAME='inmutable-v1';
const CACHE_DYNAMIC_LIMIT=50;

function limpiarCache(cacheName,numeroItems){
  caches.open(cacheName)
  .then(cache=>{
    return cache.keys()
        .then(keys=>{
          console.log(keys);
          if(keys.lenght>numeroItems){
            cache.delete(keys[0])
               .then(limpiarCache(cacheName,numeroItems))
          }
        })
  })
}



self.addEventListener('install', e=>{

	const cacheProm= caches.open(CACHE_STATIC_NAME)
         .then(cache=>{
        return cache.addAll([
          '/',
          '/index.html',
          '/index2.html',
          '/services.html',
          '/shop.html',
          '/pcbuild.html',
          '/shop_cart.html',
          '/contact.html',
          '/css/style.css',
          '/js/app.js',
            '/crud1_index.html',
            '/crud1_show.html',
            '/crud1_create.html',
            '/jqCrud_create.html',
            '/jqCrud_show.html',
            '/offline/offline.html'
    	]);
});

   const cacheInmutable= caches.open(CACHE_INMUTABLE_NAME)
         .then(cache=>{
          return cache.addAll([
              '/css/bootstrap.min.css'
      ]);
});

   e.waitUntil(Promise.all([cacheProm,cacheInmutable]));

});

// borrar version cache static

self.addEventListener('activate', e=>{

    const respuesta= caches.keys().then(keys=>{
        keys.forEach(key=>{
            if(key!==CACHE_STATIC_NAME&& key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});*/

//4. estrategia cache only
/*
self.addEventListener('fetch', e=>{
	e.respondWith(caches.match(e.request));
});

*/



//5. estrategia cache with network fallback
 /*
self.addEventListener('fetch', e=>{
  const respuesta=caches.match(e.request)
  .then(res=>{
     if(res)return res;
     //si no existe el archivo entonces debo ir a la web
     //console.log('no existe', e.request.url);
     
     return fetch(e.request).then(newResp=>{
       caches.open(CACHE_DYNAMIC_NAME)
        .then(cache=>{
           cache.put(e.request,newResp);
           limpiarCache(CACHE_DYNAMIC_NAME,CACHE_DYNAMIC_LIMIT);
        });
        return newResp.clone();
        
     });
  });

  e.respondWith(respuesta);
});

*/



//6. Estrategia network with cache fallback
/*
self.addEventListener('fetch', e=>{
    const respuesta=caches.match(e.request)
        .then(res=>{
            if(res)return res;
            //si no existe el archivo entonces debo ir a la web
            //console.log('no existe', e.request.url);

            return fetch(e.request).then(newResp=>{
                caches.open(CACHE_DYNAMIC_NAME)
                    .then(cache=>{
                        cache.put(e.request,newResp);
                        limpiarCache(CACHE_DYNAMIC_NAME,CACHE_DYNAMIC_LIMIT);
                    });
                return newResp.clone();

            })
                .catch(err=>{
                    if(e.request.headers.get('accept').includes('text/html')){
                        return caches.match('/offline/offline.html');
                    }
                });
        });

    e.respondWith(respuesta);
});*/


/*
//7. Estrategia cache with network update
 
self.addEventListener('fetch', e=>{
  
if(e.request.url.includes('bootstrap')){
  return e.respondWith(caches.match(e.request));
}
  const respuesta=caches.open(CACHE_DYNAMIC_NAME).then(cache=>{
       fetch(e.request).then(newRes=>
          cache.put(e.request,newRes));
       return caches.match(e.request);
       
  });

  e.respondWith(respuesta);
});
*/
/*
//8. Estrategia cache and network race
 
self.addEventListener('fetch', e=>{
  
const respuesta=new Promise((resolve,reject)=>{
   let rechazada=false;
   const falloUnaVez=()=>{
      if (rechazada){//si entra aca es porque no hubo respuesta ni del fetch ni de la cache
          if(/\.(png|jpg)$/i.test(e.request.url)){
             resolve(caches.match('img/main-patas-arriba.jpg'));
          }else{
            reject('no se encontró respuesta');
          }

      }else{
        rechazada=true;
       }
   };

   fetch(e.request).then(res=>{
      res.ok? resolve(res): falloUnaVez();//:

   }).catch(falloUnaVez) ;
   caches.match(e.request).then(res=>{
     res ? resolve(res):falloUnaVez();

   }).catch(falloUnaVez);

});

  e.respondWith(respuesta);
});

*/

