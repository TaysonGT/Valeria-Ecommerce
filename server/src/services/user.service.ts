import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { IUser, User } from '../schemas/user.schema'

const JWT_SECRET = process.env.JWT_SECRET || 'tayson'

export const hashPassword = (password: string, salt: string) => {
  return crypto.scryptSync(password, salt, 64).toString('hex')
}

export const createSalt = () => crypto.randomBytes(16).toString('hex')

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      user_id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const sanitizeUser = (user: IUser) => {
  const { _id, username, email, firstname, lastname, gender, role, paymentDetails, createdAt, updatedAt } = user
  return {
    _id,
    username,
    email,
    firstname,
    lastname,
    gender,
    role,
    paymentDetails,
    createdAt,
    updatedAt,
  }
}

export const findUserByUsername = async (username: string) => {
  return User.findOne({ username }).exec()
}

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email }).exec()
}

export const findUserById = async (id: string) => {
  return User.findById(id).exec()
}

export const registerUser = async (payload: {
  username: string
  firstname: string
  lastname: string
  email: string
  gender: string
  password: string
}) => {
  const existingByUsername = await findUserByUsername(payload.username)
  if (existingByUsername) {
    throw new Error('Username already exists')
  }

  const existingByEmail = await findUserByEmail(payload.email)
  if (existingByEmail) {
    throw new Error('Email already exists')
  }

  const salt = createSalt()
  const passwordHash = hashPassword(payload.password, salt)
  const user = new User({
    username: payload.username,
    firstname: payload.firstname,
    lastname: payload.lastname,
    email: payload.email,
    gender: payload.gender,
    passwordHash,
    passwordSalt: salt,
  })

  await user.save()
  return sanitizeUser(user)
}

export const validateCredentials = async (username: string, password: string) => {
  const user = await findUserByUsername(username)
  if (!user) return null
  const hashed = hashPassword(password, user.passwordSalt)
  if (hashed !== user.passwordHash) return null
  return user
}
