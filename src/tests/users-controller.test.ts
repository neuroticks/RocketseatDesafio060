import request from "supertest"
import { prisma } from "@/database/prisma"

import { app } from "@/app"

describe("UsersController", () => {
  let user_id: number

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Fulano Membro",
      email: "fulano@example.com",
      password: "123123",
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Fulano Membro")
    expect(response.body.role).toBe("member")

    user_id = response.body.id
  })

  it("should throw an error if user with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Sicrano Duplicado",
      email: "fulano@example.com",
      password: "abcabc",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User with same email already exists")
  })

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Beltrano Not ValidEmail",
      email: "invalid-email",
      password: "xyzxyz",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("validation error")
  })
})
