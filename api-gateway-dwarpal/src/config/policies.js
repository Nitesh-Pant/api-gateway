const routesPolicies =  [
    {path: "/users/register", auth: false, rateLimit:{type: "ip-based", service: 'users'}},

    {path: "/users/login", auth: false, rateLimit:{type: "ip-based", service: 'users'}},

    {path: "/users/:id", auth: true, role: ["user", "admin"], rateLimit:{type: "token-based", service: 'users'}},

    {path: "/users/a/users", auth: true, role: ["admin"], rateLimit:{type: "token-based", service: 'users'}},

    {path: "/orders/", auth: true,  role: ["user", "admin"], rateLimit:{type: "token-based", service: 'orders'}},

    {path: "/orders/me", auth: true,  role: ["user", "admin"], rateLimit:{type: "token-based", service: 'orders'}},

    {path: "/orders/:id", auth: true,  role: ["user", "admin"], rateLimit:{type: "token-based", service: 'orders'}},

    {path: "/orders/a/orders", auth: true, role: ['admin'], rateLimit:{type: "token-based", service: 'orders'}}
]

export default  routesPolicies;
