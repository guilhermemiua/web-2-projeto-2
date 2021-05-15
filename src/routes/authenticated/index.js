const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const PokemonController = require('../../controllers/PokemonController');
const cache = require('../../config/redis');

const routes = express.Router();

routes.get('/pokemons', cache.route(), (request, response) =>
  PokemonController.findAll(request, response)
);
routes.post(
  '/pokemons',
  cache.invalidate(),
  upload.single('file'),
  (request, response) => PokemonController.create(request, response)
);
routes.delete('/pokemons/:id', cache.invalidate(), (request, response) =>
  PokemonController.delete(request, response)
);
routes.put(
  '/pokemons/:id',
  cache.invalidate(),
  upload.single('file'),
  (request, response) => PokemonController.update(request, response)
);

module.exports = routes;