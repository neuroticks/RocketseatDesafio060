import { Router } from "express"

import { TeamsController } from "@/controllers/teams-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const teamsRoutes = Router()
const lTeamController = new TeamsController()

// básico (criação de novo time // atualização de time existente // listagem de todos os times // exclusão de um time)
teamsRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTeamController.create)
teamsRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), lTeamController.index)
teamsRoutes.patch("/:team_id", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTeamController.update)
teamsRoutes.delete("/:team_id", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTeamController.delete)

// avançado (associação de usuário a um time // remoção de usuário de um time // listagem de usuários de um time)
teamsRoutes.post("/:team_id/:user_id", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTeamController.add)
teamsRoutes.delete("/:team_id/:user_id", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTeamController.remove)
teamsRoutes.get("/:team_id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), lTeamController.list)

export { teamsRoutes }