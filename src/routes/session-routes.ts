import { Router } from "express"
import { SessionsController } from "@/controllers/session-controller"

const sessionRoutes = Router()
const sessionController = new SessionsController()

sessionRoutes.post("/", sessionController.autentica)

export { sessionRoutes }
