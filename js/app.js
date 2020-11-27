
//confirmar si podemos usar el serviceworker en el navegador
/*
if(navigator.serviceWorker){
	console.log ("es posible usar el service worker con este navegador");
}
*/


if(navigator.serviceWorker){
		

	navigator.serviceWorker.register('/sw.js');
}
/*
//4. peticiones fetch
fetch("https://reqres.in/api/users")
   //.then(resp=>resp.json())
    .then(resp=>resp.text())
   .then(console.log)
*/



//5 en sync

// if ( window.SyncManager ) { }
/*
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js')
            .then( reg => {

                 setTimeout(() => {
                    
                     reg.sync.register('posteo-chicas');
                     console.log('Se enviaron fotos de chicas al server');

                 }, 3000);
               
            
                });
}
*/


// 6. notificaciones push
/*
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js')
            .then( reg => {

                // setTimeout(() => {
                    
                //     reg.sync.register('posteo-gatitos');
                //     console.log('Se enviaron fotos de gatitos al server');

                // }, 3000);
                Notification.requestPermission().then( result => {
            
                    console.log(result);
                    reg.showNotification('Hola Mundo...!');
                    
            
                });

            });


            

}
*/
