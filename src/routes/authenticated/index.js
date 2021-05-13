const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const PokemonController = require('../../controllers/PokemonController');

const routes = express.Router();

routes.get('/pokemons', (request, response) =>
  PokemonController.findAll(request, response)
);
routes.post('/pokemons', upload.single('file'), (request, response) =>
  PokemonController.create(request, response)
);
routes.delete('/pokemons/:id', (request, response) =>
  PokemonController.delete(request, response)
);
routes.put('/pokemons/:id', upload.single('file'), (request, response) =>
  PokemonController.update(request, response)
);

module.exports = routes;
