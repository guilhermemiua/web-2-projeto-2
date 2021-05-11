const bcrypt = require('bcrypt');
const connection = require('../database/connection');

class UserController {
  async register(request, response) {
    try {
      const { name, email, password } = request.body;

      // Verify if e-mail is already registered
      const existsEmail = await connection
        .select('id', 'name', 'email')
        .where('email', email)
        .from('users')
        .first();

      if (existsEmail) {
        return response
          .status(400)
          .send({ message: 'E-mail is already being used.' });
      }

      // Hashing password
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await connection
        .returning(['id', 'name', 'email'])
        .insert({
          name,
          email,
          password: hashPassword,
          role: 'user',
        })
        .into('users');

      return response.status(201).send(user[0]);
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' });
    }
  }

  async authenticate(request, response) {
    try {
      const { email, password } = request.body;

      const user = await connection
        .select(['id', 'password'])
        .where('email', email)
        .from('users')
        .first();

      // Never tell the user if the e-mail is incorrect or the password
      if (!user) {
        return response
          .status(404)
          .send({ message: 'E-mail or Password incorrect.' });
      }

      // Authenticate user password
      const isValidPassword = await bcrypt.compare(password, user.password);

      // Never tell the user if the e-mail is incorrect or the password
      if (!isValidPassword) {
        return response
          .status(400)
          .send({ message: 'E-mail or Password incorrect.' });
      }

      return response.status(201).send();
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' });
    }
  }
}

module.exports = new UserController();