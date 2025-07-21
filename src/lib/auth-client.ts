import { createAuthClient } from "better-auth/react"
import { polarClient } from "@polar-sh/better-auth"

export const authClient = createAuthClient({
    plugins: [polarClient()],
    baseURL: "http://localhost:3000"
})