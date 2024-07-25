const request = require('supertest')
const app = require('../app')

const { sequelize, User } = require('../models/')
const { hashPassword } = require('../helpers/bcrypt')
const { queryInterface } = sequelize
const { signToken } = require('../helpers/jwt')

let token
let tokenStaff

beforeAll(async () => {
  await queryInterface.bulkInsert('Users', [
    {
      email: "jisoo@mail.com",
      password: hashPassword('12345'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "jennie@mail.com",
      password: hashPassword('12345'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  token = signToken({ id: 1 })
  tokenStaff = signToken({ id: 2 })

  await queryInterface.bulkInsert('Movies', [
    {
      title: "John Wick",
      rating: 10,
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: "John Wick 2",
      rating: 9,
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: "John Wick 3",
      rating: 7,
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], null)
})

afterAll(async () => {
  try {
    await queryInterface.bulkDelete('Movies', {}, {
      truncate: true, restartIdentity: true, cascade: true
    })
  
    await queryInterface.bulkDelete('Users', {}, {
      truncate: true, restartIdentity: true, cascade: true
    })
  } catch(err) {
    console.log(err, '<---- err')
  }
})

describe('GET /movies', () => {
  test('Success 200', async () => {
    const response = await request(app)
      .get('/movies')
      .set('Authorization', 'Bearer ' + token)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toHaveProperty('title', expect.any(String))
    expect(response.body[0]).toHaveProperty('rating', expect.any(Number))
  })
})

describe('POST /movies', () => {
  describe('Success', () => {
    test('Success 200', async () => {
      const response = await request(app)
        .post('/movies')
        .send({ title: "John Wick", rating: 10 })
        .set('Authorization', `Bearer`)
      console.log(response.body, '<< ini')
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('title', "John Wick")
      expect(response.body).toHaveProperty('rating', 10)
    })
  })

  describe('Failed', () => {
    test('Failed 400 no title', async () => {
      const response = await request(app).post('/movies')
      console.log(response.body, '<-- res failed')
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', "Title is required")
      // expect(response.body).toHaveProperty('name', expect.any(String))
    })
  })
})

