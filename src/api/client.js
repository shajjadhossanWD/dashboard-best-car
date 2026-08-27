// Mock transport. Point these at a real backend and nothing above api/ changes.
const DEFAULT_LATENCY = [220, 620]

// Set VITE_API_FAILURE_RATE to exercise the error states.
const FAILURE_RATE = Number(import.meta.env?.VITE_API_FAILURE_RATE ?? 0)

export class ApiError extends Error {
  constructor(message, { status = 500, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

const randomLatency = () => {
  const [min, max] = DEFAULT_LATENCY
  return min + Math.random() * (max - min)
}

export function request(producer, { signal, latency = randomLatency() } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)

      if (FAILURE_RATE > 0 && Math.random() < FAILURE_RATE) {
        reject(new ApiError('The service is temporarily unavailable.', { status: 503 }))
        return
      }

      try {
        resolve(producer())
      } catch (error) {
        reject(new ApiError(error.message || 'Unexpected error', { cause: error }))
      }
    }, latency)

    function onAbort() {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
