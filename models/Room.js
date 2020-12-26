const { Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => { 
    const Room = sequelize.define('room', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: { 
            type: Sequelize.STRING(255),
            primaryKey: false,
            allowNull: false,

        },
        tags: {
            type: Sequelize.STRING(255),
            allowNull: false,
            primaryKey: false
        },
    }, {
        timestamps: false
    });
    
    return Room;
}