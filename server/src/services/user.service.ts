import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { IUser, User } from '../schemas/user.schema'

const JWT_SECRET = process.env.JWT_SECRET || 'tayson'

export class UserService {
  hashPassword = (password: string, salt: string) => {
    return crypto.scryptSync(password, salt, 64).toString('hex')
  }
  
  createSalt = () => crypto.randomBytes(16).toString('hex')
  
  generateToken = (user: IUser): string => {
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
  
  sanitizeUser = (user: IUser) => {
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

  findUserByUsername = async (username: string) => {
    return User.findOne({ username }).exec()
  }
  
  findUserByEmail = async (email: string) => {
    return User.findOne({ email }).exec()
  }
  
  findUserById = async (id: string) => {
    return User.findById(id).exec()
  }
  
  registerUser = async (payload: {
    username: string
    firstname: string
    lastname: string
    email: string
    gender: string
    password: string
  }) => {
    const existingByUsername = await this.findUserByUsername(payload.username)
    if (existingByUsername) {
      throw new Error('Username already exists')
    }
  
    const existingByEmail = await this.findUserByEmail(payload.email)
    if (existingByEmail) {
      throw new Error('Email already exists')
    }
  
    const salt = this.createSalt()
    const passwordHash = this.hashPassword(payload.password, salt)
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
    return this.sanitizeUser(user)
  }
  
  validateCredentials = async (username: string, password: string) => {
    const user = await this.findUserByUsername(username)
    if (!user||!user.passwordHash||!user.passwordSalt) return null
    const hashed = this.hashPassword(password, user.passwordSalt)
    if (hashed !== user.passwordHash) return null
    return user
  }

  findOrCreateGoogleUser = async (payload: {
    googleId: string
    email: string
    firstname: string
    lastname: string
  }) => {
    let user = await User.findOne({ googleId: payload.googleId })
    if (user) return user

    const existingByEmail = await this.findUserByEmail(payload.email)
    if (existingByEmail) {
      throw new Error('An account with this email already exists')
    }

    const username = payload.email.split('@')[0] + '-' + payload.googleId.slice(-5)

    user = new User({
      username,
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      gender: 'unspecified',
      provider: 'google',
      googleId: payload.googleId,
    })

    await user.save()
    return user
  }
}

