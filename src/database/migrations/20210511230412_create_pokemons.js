exports.up = function (knex) {
  return knex.schema.createTable('pokemons', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.string('image_name').notNullable();
    table.string('type_1').notNullable();
    table.string('type_2');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('pokemons');
};
