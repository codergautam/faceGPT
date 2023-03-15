// db.js
import postgres from 'postgres'

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {rejectUnauthorized:false}
});


async function getUser(id) {
  const user = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return user[0]
}

async function userExists(email) {
  const user = await sql`
    SELECT id FROM users WHERE email = ${email}
  `
  return user[0] ? user[0].id : false
}

async function createUser({ username, email }) {
  await sql`
    INSERT INTO users (username, email) VALUES (${username}, ${email})
  `
  const id = await userExists(email)
  return id
}

export{
  getUser,
  userExists,
  createUser,
}