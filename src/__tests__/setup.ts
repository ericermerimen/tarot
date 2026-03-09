import '@testing-library/jest-dom/vitest'

// Provide a full Web Storage implementation for environments where jsdom
// does not expose localStorage (e.g. vitest 4 without a configured origin URL).
function makeStorage() {
  let store: Record<string, string> = {}
  return {
    getItem(key: string) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null },
    setItem(key: string, value: string) { store[key] = String(value) },
    removeItem(key: string) { delete store[key] },
    clear() { store = {} },
    key(i: number) { return Object.keys(store)[i] ?? null },
    get length() { return Object.keys(store).length },
  }
}

if (typeof localStorage === 'undefined' || typeof localStorage.clear !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', { value: makeStorage(), writable: true })
}
if (typeof sessionStorage === 'undefined' || typeof sessionStorage.clear !== 'function') {
  Object.defineProperty(globalThis, 'sessionStorage', { value: makeStorage(), writable: true })
}
