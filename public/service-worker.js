self.addEventListener('install', function(event) {
  // console.log('registering service worker...')
})

self.addEventListener('fetch', function(event) {
  // console.log('intercepting requests to check for the file or data in the cache')
})

self.addEventListener('activate', function(event) {
  // console.log('service worker activated')
})