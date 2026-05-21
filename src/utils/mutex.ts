const userLocks = new Map<string, Promise<void>>();

export async function acquireLock(userId: string): Promise<() => void> {
    let release!: () => void;

    const lockPromise = new Promise<void>((resolve) => {
        release = resolve;
    });

    const existingLock = userLocks.get(userId);

    userLocks.set(
        userId,
        existingLock
            ? existingLock.then(() => lockPromise)
            : lockPromise
    );

    if (existingLock) {
        await existingLock;
    }

    return () => {
        release();

        if (userLocks.get(userId) === lockPromise) {
            userLocks.delete(userId);
        }
    };
}