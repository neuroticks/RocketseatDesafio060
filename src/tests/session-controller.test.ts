import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("SessionController", () => {
    let l_user_id: number

    beforeAll(async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Testano de Tal",
            email: "testano@email.com",
            password: "123abc"
        })

        l_user_id = userResponse.body.id
    })

    it("should Autenticar e receber o Token de Acesso", async () => {

        const sessionResponse = await request(app).post("/sessions").send({
            email: "testano@email.com",
            password: "123abc"
        })

        expect(sessionResponse.status).toBe(200)

        expect(sessionResponse.body.token).toEqual(expect.any(String))

    })

    it("should Falhar autenticação quando [usuário] ou senha inconsistentes", async () => {

        const sessionResponse = await request(app).post("/sessions").send({
            email: "Xtestano@email.com",
            password: "123abc"
        })

        expect(sessionResponse.status).toBe(401)

        expect(sessionResponse.body.message).toBe("Invalid email or password")

    })

    it("should Falhar autenticação quando usuário ou [senha] inconsistentes", async () => {

        const sessionResponse = await request(app).post("/sessions").send({
            email: "testano@email.com",
            password: "X123abc"
        })

        expect(sessionResponse.status).toBe(401)

        expect(sessionResponse.body.message).toBe("Invalid email or password")

    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: l_user_id } })
    })

})