import { Router } from "express"

import { TasksController } from "@/controllers/tasks-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const tasksRoutes = Router()
const lTasksController = new TasksController()

//manipulação básica de tarefas (criar // listar // modificar // excluir // definir prioridade // modificar status)
tasksRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTasksController.create)
tasksRoutes.patch("/:task_id", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTasksController.update)
tasksRoutes.delete("/:task_id", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTasksController.cancel)
// retorna as tasks do Time a que pertence o Usuário agrupadas por Status
tasksRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), lTasksController.index)
tasksRoutes.patch("/:task_id/update_status", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), lTasksController.update_status)

//manipulação avançada (atribuir a um time // atribuir um responsável pela tarefa)
//tasksRoutes.patch("/:task_id/set_team", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTasksController.set_team)
//tasksRoutes.patch("/:task_id/assign_responsible", ensureAuthenticated, verifyUserAuthorization(["admin"]), lTasksController.assign_responsible)

export { tasksRoutes }