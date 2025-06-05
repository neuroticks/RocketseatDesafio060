import { env } from "../env"
import type { StringValue } from "ms";

const l_exp: StringValue = '1h'

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: l_exp
  }
}