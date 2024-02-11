import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import databaseConnection from './db.js'
import signupRouter from './Routes/Signup.js'
import { emailVerificationRouter } from './Routes/EmailConfirmation.js'
import { loginRouter } from './Routes/Login.js'
import { forgotRouter } from './Routes/Forgot.js'
import { URLRouter } from './Routes/Shortning.js'
import usersignin from './Controllers/UserAutentication.js'
import { redirectRouter } from './Routes/RedirecctURL.js'
import { activationRouter } from './Routes/ActivateAccount.js'

// initializing the server using express
const app = express()


// dotenv configuration
dotenv.config()


// DataBase Connection
databaseConnection()


// Middle Wares
app.use(express.json())
app.use(cors())

// Routers
// signup router
app.use("/signup",signupRouter)

// Account activation router
app.use("/activate",activationRouter) 

// email verifing router
app.use("/verify",emailVerificationRouter)


// login router
app.use("/login",loginRouter)

// forgot Router
app.use("/forgot",forgotRouter)

// URL Router
app.use("/shorturl",usersignin,URLRouter)

// redirect url router
app.use("/",redirectRouter)

// local host
app.listen(process.env.PORT,()=>console.log(`server started at ${process.env.PORT}`))