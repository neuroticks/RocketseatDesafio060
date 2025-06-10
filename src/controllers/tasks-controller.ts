import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { late, z } from "zod"

class TasksController {

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().trim().min(5),
      description: z.string(),
      status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
      priority: z.enum(["high", "medium", "low"]).default("low"),
      assign_to: z.coerce.number().optional().nullable(),
      team_id: z.coerce.number().optional().nullable()
    })

    const { title, description, status, priority, assign_to, team_id } = bodySchema.parse(request.body)

    const l_data: any = { title, description, status, priority }
    l_data.assignedTo = assign_to ?? null
    l_data.teamId = team_id ?? null

    const l_task_created = await prisma.task.create({
      data: l_data
    })

    return response.status(201).json({ taskCreated: l_task_created })

  }

  async update(request: Request, response: Response) {
    const paramSchema = z.object({
      task_id: z.coerce.number().positive()
    })

    const { task_id } = paramSchema.parse(request.params)

    const l_task = await prisma.task.findFirst({ where: { id: task_id } })

    if (!l_task) {
      throw new AppError("Tarefa inconsistente.")
    }

    const bodySchema = z.object({
      title: z.string().trim().min(5).optional(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      assign_to: z.coerce.number().optional(),
      team_id: z.coerce.number().optional()
    })

    const { title, description, status, priority, assign_to, team_id } = bodySchema.parse(request.body)

    const l_data: any = {}
    if (title !== undefined) { l_data.title = title }
    if (description !== undefined) { l_data.description = description }
    if (status !== undefined) { l_data.status = status }
    if (priority !== undefined) { l_data.priority = priority }
    if (assign_to !== undefined) { l_data.assignedTo = assign_to }
    if (team_id !== undefined) { l_data.teamId = team_id }

    const l_task_updated = await prisma.task.update({
      where: { id: task_id },
      data: l_data
    })

    const taskUpdated = await prisma.task.findFirst({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        user: {
          select: {
            name: true
          }
        },
        team: {
          select: {
            name: true
          }
        },
        createdAt: true,
        updatedAt: true,
      },
      where: { id: task_id }
    })

    return response.status(201).json({ taskUpdated })

  }

  async cancel(request: Request, response: Response) {
    const paramSchema = z.object({
      task_id: z.coerce.number().positive()
    })

    const { task_id } = paramSchema.parse(request.params)

    const taskDeleted = await prisma.task.delete({ where: { id: task_id } })

    return response.json({ taskDeleted })
  }

  async index(request: Request, response: Response) {

    const l_tasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        user: {
          select: {
            name: true
          }
        },
        team: {
          select: {
            name: true
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    return response.json({ tasks: l_tasks })

  }

  async update_status(request: Request, response: Response) {
    const user_id = request.user?.id
    console.log(`---------user_id[${user_id}]`)
    const role = request.user?.role
    console.log(`---------role[${role}]`)

    const paramSchema = z.object({
      task_id: z.coerce.number().positive()
    })

    const { task_id } = paramSchema.parse(request.params)

    const l_task = await prisma.task.findFirst({ where: { id: task_id } })
    console.log(`---------l_task?.assignedTo[${l_task?.assignedTo}]`)

    if (role !== "admin") {
      if (user_id != l_task?.assignedTo) {
        throw new AppError("Unauthorized", 401)
      }
    }

    if (!l_task) {
      throw new AppError("Tarefa inconsistente.")
    }

    const bodySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"])
    })

    const { status } = bodySchema.parse(request.body)

    const l_data: any = {}
    if (status !== undefined) { l_data.status = status }

    const task = await prisma.task.findFirst({
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: task_id }
    })

    const l_task_updated = await prisma.task.update({
      where: { id: task_id },
      data: l_data
    })

    return response.status(201).json({ taskUpdated: { id: task_id, previous_status: task?.status, new_status: status, createdAt: task?.createdAt, updatedAt: task?.updatedAt } })

  }

}

export { TasksController }
