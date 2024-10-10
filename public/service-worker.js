// eslint-disable-next-line unused-imports/no-unused-vars
const _INTEGRITY_CHECKSUM = '3d6b9f06410d179a7f7404d4bf4c3c70'

const deleteCache = async (key) => {
  await caches.delete(key)
}

const deleteOldCaches = async () => {
  const cacheKeepList = []
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key))
  await Promise.all(cachesToDelete.map(deleteCache))
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches())
})
