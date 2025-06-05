import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { authConfig } from "@/configs/auth"
import { prisma } from "@/database/prisma"
import { sign, SignOptions } from "jsonwebtoken"

import { compare } from "bcrypt"
import { z } from "zod"

class SessionsController {
  async autentica(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const userFound = await prisma.user.findFirst({
      where: { email },
    })

    if (!userFound) {
      throw new AppError("Invalid email or password", 401)
    }

    const passwordMatched = await compare(password, userFound.password)

    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    interface TokenPayload {
      role: string;
    }
    const payload: TokenPayload = {
      role: String(userFound.role) ?? "member"
    };

    const options: SignOptions = {
      expiresIn: expiresIn,
      subject: String(userFound.id)
    };

    const token = sign(payload, secret, options)

    const { password: hashedPassword, ...userWithoutPassword } = userFound

    return response.json({ token, user: userWithoutPassword })
  }
}

export { SessionsController }