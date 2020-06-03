
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A script which is used by the service worker to handle push notifications.
 * 
 */

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event){    
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function(event){
    console.log("Received a push notification.");   
    return self.registration.showNotification('ServiceWorker Cookbook', {
        body: "newmessage",
        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    });
});

self.addEventListener("notificationclick", function(event){
    console.log("haha");
});
