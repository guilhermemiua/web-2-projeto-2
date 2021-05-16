const fs = require('fs');
const path = require('path');
const connection = require('../database/connection');

class PokemonController {
  async findAll(request, response) {
    try {
      const { name } = request.query;

      const query = connection.select([
        'id',
        'name',
        'image_name',
        'type_1',
        'type_2',
      ]);

      if (name) {
        query.whereRaw("LOWER(name) LIKE '%' || LOWER(?) || '%' ", name);
      }

      const pokemons = await query.from('pokemons');

      return response.status(200).send(pokemons);
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' });
    }
  }

  async create(request, response) {
    try {
      const { name, type_1, type_2 } = request.body;
      const { file } = request;

      if (!name || !type_1 || !file) {
        return response.status(400).send({ message: 'Fields not provided.' });
      }

      const pokemon = await connection
        .returning(['id', 'name', 'type_1', 'type_2'])
        .insert({
          name,
          type_1,
          type_2,
          image_name: file.filename,
        })
        .into('pokemons');

      return response.status(201).send(pokemon[0]);
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' });
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const { name, type_1, type_2 } = request.body;
      const { file } = request;

      const pokemon = await connection
        .select(['id', 'name', 'image_name', 'type_1', 'type_2'])
        .where('id', id)
        .from('pokemons')
        .first();

      if (!pokemon) {
        return response.status(404).send({ message: 'Pokemon not found' });
      }

      if (file) {
        await fs.unlinkSync(
          path.join(__dirname, `../../uploads/${pokemon.image_name}`)
        );

        await connection('pokemons')
          .update({
            name,
            type_1,
            type_2,
            image_name: file.filename,
          })
          .where('id', id);
      } else {
        await connection('pokemons')
          .update({
            name,
            type_1,
            type_2,
          })
          .where('id', id);
      }

      return response.status(200).send({ message: 'Success' });
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' });
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;

      const pokemon = await connection
        .select(['id', 'name', 'image_name', 'type_1', 'type_2'])
        .where('id', id)
        .from('pokemons')
        .first();

      if (!pokemon) {
        return response.status(404).send({ message: 'Pokemon not found' });
      }

      if (pokemon.image_name) {
        await fs.unlinkSync(
          path.join(__dirname, `../../uploads/${pokemon.image_name}`)
        );
      }

      const test = await connection('pokemons').where('id', id).delete();

      console.log(test);

      return response.status(200).send({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }
}

module.exports = new PokemonController();
