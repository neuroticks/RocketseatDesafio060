import { Router } from "express"

import { usersRoutes } from "./users-routes"
import { sessionRoutes } from "./session-routes"
import { teamsRoutes } from "./teams-routes"
import { tasksRoutes } from "./tasks-routes"

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/tasks", tasksRoutes)

export { routes }
