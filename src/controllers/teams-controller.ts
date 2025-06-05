import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"
import { tr } from "zod/v4/locales"

class TeamsController {

  // Novo TEAM
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      description: z.string(),
    })

    const { name, description } = bodySchema.parse(request.body)

    const l_team_created = await prisma.team.create({
      data: {
        name,
        description
      }
    })

    return response.status(201).json(l_team_created)
  }

  // Lista TEAMS
  async index(request: Request, response: Response) {
    const l_teams = await prisma.team.findMany()

    return response.json({ users: l_teams })
  }

  // Atualiza TEAM
  async update(request: Request, response: Response) {
    const paramSchema = z.object({
      team_id: z.coerce.number().gt(0)
    })
    const { team_id } = paramSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string().min(2, 'Nome do time é obrigatório').optional(),
      description: z.string().optional()
    }).refine(data => data.name !== undefined || data.description !== undefined, {
      message: 'Pelo menos um campo (nome ou descricao) deve ser fornecido para atualização'
    })

    const { name, description } = bodySchema.parse(request.body)

    const lTeamUpdated = await prisma.team.update({
      where: { id: team_id },
      data: {
        name,
        description
      }
    });

    return response.status(201).json(lTeamUpdated)
  }

  // Exclui TEAM
  async delete(request: Request, response: Response) {
    const paramSchema = z.object({
      team_id: z.coerce.number().gt(0)
    })
    const { team_id } = paramSchema.parse(request.params)

    const lUsersInTeam = await prisma.teamMember.count({
      where: {
        teamId: team_id,
      },
    });

    if (lUsersInTeam === 0) {
      throw new AppError("Time não válido.")
    }

    if (lUsersInTeam > 0) {
      throw new AppError("Existem usuários associados ao time.")
    }

    const lTeamDeleted = await prisma.team.delete({
      where: { id: team_id },
    });

    return response.json(lTeamDeleted)
  }

  // Associa USUARIO a um TIME
  async add(request: Request, response: Response) {
    const paramSchema = z.object({
      team_id: z.coerce.number().gt(0),
      user_id: z.coerce.number().gt(0)
    })
    const { team_id, user_id } = paramSchema.parse(request.params)

    const lUser = await prisma.user.findFirst({ where: { id: user_id } })
    if (!lUser) {
      throw new AppError("Usuário inconsistente.")
    }

    const lTeam = await prisma.team.findFirst({ where: { id: team_id } })
    if (!lTeam) {
      throw new AppError("Time inconsistente.")
    }

    const lTeamUser = await prisma.teamMember.findFirst({ where: { teamId: team_id, userId: user_id } })
    if (lTeamUser) {
      throw new AppError("Usuário já é membro deste Time.")
    }

    await prisma.teamMember.create({ data: { userId: user_id, teamId: team_id } })

    const TeamMemberAdded = await prisma.teamMember.findMany({
      select: {
        user: {
          select: {
            id: true,
            name: true,
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: {
        teamId: team_id,
        userId: user_id
      }
    })

    return response.json({ TeamMemberAdded })
  }

  // Lista USUARIOS em um TIME
  async list(request: Request, response: Response) {
    const paramSchema = z.object({
      team_id: z.coerce.number().gt(0),
    })
    const { team_id } = paramSchema.parse(request.params)

    const lTeam = await prisma.team.findFirst({ where: { id: team_id } })
    if (!lTeam) {
      throw new AppError("Time inconsistente.")
    }

    const lTeamWithUsers = await prisma.team.findUnique({
      where: { id: team_id },
      include: {
        TeamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    })

    // Formatação do resultado:
    const TeamMembers = {
      team: {
        id: lTeamWithUsers?.id,
        name: lTeamWithUsers?.name
      },
      users: lTeamWithUsers?.TeamMembers.map((tm) => ({
        id: tm.user.id,
        name: tm.user.name,
      })),
    };

    return response.json({ TeamMembers })
  }

  // Remove USUARIO de um TIME
  async remove(request: Request, response: Response) {
    const paramSchema = z.object({
      team_id: z.coerce.number().gt(0),
      user_id: z.coerce.number().gt(0)
    })
    const { team_id, user_id } = paramSchema.parse(request.params)

    const TeamMemberRemoved = await prisma.teamMember.findFirst({
      where: {
        teamId: team_id,
        userId: user_id
      },
      select: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (TeamMemberRemoved) {
      await prisma.teamMember.deleteMany({ where: { teamId: team_id, userId: user_id } })
    }

    return response.json({ TeamMemberRemoved })
  }

}

export { TeamsController }
