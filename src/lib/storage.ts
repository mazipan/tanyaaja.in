export const getValueFromStorage = (key: string) => {
  return window.sessionStorage.getItem(key)
}

export const setValueToStorage = (key: string, value: string) => {
  window.sessionStorage.setItem(key, value)
}
