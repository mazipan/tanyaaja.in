const isSessionStorageSupported = () => {
  const storage = window.sessionStorage
  try {
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}

export const getValueFromStorage = (key: string) => {
  return isSessionStorageSupported() ? window.sessionStorage.getItem(key) : ''
}

export const setValueToStorage = (key: string, value: string) => {
  isSessionStorageSupported() && window.sessionStorage.setItem(key, value)
}
