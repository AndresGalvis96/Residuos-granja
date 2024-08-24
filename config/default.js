import dotenv from "dotenv";
dotenv.config()

export const exports ={
    port : process.env.PORT,
    postgres : process.env.URL_POSTGRES,
    secret: process.env.SECRET_KEY
}
