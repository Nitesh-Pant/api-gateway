const routesPolicies =  [
    {path: "/users/register", auth: false},
    {path: "/users/login", auth: false},
    {path: "/users/:id", auth: true},
    {path: "/users/a/users", auth: true, role: ["admin"]},
    {path: "/orders/", auth: true},
    {path: "/orders/me", auth: true},
    {path: "/orders/:id", auth: true},
    {path: "/orders/a/orders", auth: true, role: ['admin']}
]

export default  routesPolicies;
