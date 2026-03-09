//Se implementó un mecanismo de Rate Limiting utilizando la estrategia Fixed Window. 

type RateRecord = {
    count: number
    startTime: number
}

const requests = new Map<string, RateRecord>()

const WINDOW_SIZE = 60 * 1000 // 1 minuto
const MAX_REQUESTS = 5

export function rateLimit(identifier: string): boolean {
    const now = Date.now()

    const record = requests.get(identifier)

    if (!record) {
        requests.set(identifier, {
            count: 1,
            startTime: now
        })
        return true
    }

    const elapsed = now - record.startTime

    if (elapsed > WINDOW_SIZE) {
        requests.set(identifier, {
            count: 1,
            startTime: now
        })
        return true
    }

    if (record.count >= MAX_REQUESTS) {
        return false
    }

    record.count++
    return true
}