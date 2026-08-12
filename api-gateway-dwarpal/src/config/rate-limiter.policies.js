const rateLimiterConfig = {
    users: {
        capacity: 5,
        refillRate: 5,
        initialToken: 5
    },
    orders: {
        capacity: 10,
        refillRate: 10,
        initialToken: 5
    },
}

export default rateLimiterConfig;
