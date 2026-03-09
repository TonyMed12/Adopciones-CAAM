type RateLimitRecord = {
    count: number;
    timestamp: number;
};

const WINDOW_SIZE = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 5;

const requests = new Map<string, RateLimitRecord>();

export function rateLimit(ip: string) {
    const now = Date.now();

    const record = requests.get(ip);

    // si no existe registro
    if (!record) {
        requests.set(ip, {
            count: 1,
            timestamp: now,
        });
        return true;
    }

    const timePassed = now - record.timestamp;

    if (timePassed > WINDOW_SIZE) {
        requests.set(ip, {
            count: 1,
            timestamp: now,
        });
        return true;
    }

    // si excede el límite
    if (record.count >= MAX_REQUESTS) {
        return false;
    }

    // aumentar contador
    record.count += 1;
    requests.set(ip, record);

    return true;
}