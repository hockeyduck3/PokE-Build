module.exports = function(sequelize, DataTypes) {
  const Pokemon = sequelize.define('Pokemon', {
    name: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    speed: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    spdefense: DataTypes.INTEGER,
    attack: DataTypes.INTEGER,
    spattack: DataTypes.INTEGER,
    moveid1: DataTypes.INTEGER,
    moveid2: DataTypes.INTEGER,
    moveid3: DataTypes.INTEGER,
    moveid4: DataTypes.INTEGER
  });

  Pokemon.associate = function(models) {
    Pokemon.belongsTo(models.Creator, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Pokemon;
};
