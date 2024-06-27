import FingerprintJS, { type Agent } from '@fingerprintjs/fingerprintjs'

let fp: Agent | null = null

const FINGERPRINT_KEY = 'ta_fp'
export const getDeviceIdFingerprint = async (): Promise<string> => {
  await loadFingerprint()

  return localStorage.getItem(FINGERPRINT_KEY) ?? ''
}

export const loadFingerprint = async () => {
  if (!fp) {
    fp = await FingerprintJS.load()
  }

  if (!localStorage.getItem(FINGERPRINT_KEY)) {
    const { visitorId } = await fp.get()
    localStorage.setItem(FINGERPRINT_KEY, visitorId)
  }
}
