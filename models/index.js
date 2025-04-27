const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

const models = { User, Store, Rating };

// Define relationships
User.hasMany(Rating, { foreignKey: "userId" });
Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

module.exports = models;
