const routesPolicies =  [
    {path: "/users/register", auth: false},
    {path: "/users/login", auth: false},
    {path: "/users/:id", auth: true, role: ["user", "admin"]},
    {path: "/users/a/users", auth: true, role: ["admin"]},
    {path: "/orders/", auth: true,  role: ["user", "admin"]},
    {path: "/orders/me", auth: true,  role: ["user", "admin"]},
    {path: "/orders/:id", auth: true,  role: ["user", "admin"]},
    {path: "/orders/a/orders", auth: true, role: ['admin']}
]

export default  routesPolicies;
