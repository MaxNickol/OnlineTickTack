const { Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => { 
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: { 
            type: Sequelize.STRING(32),
            primaryKey: false,
            allowNull: false,

        },
        password: {
            type: Sequelize.STRING(128),
            allowNull: false,
            primaryKey: false
        },
        wins: { 
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: false,
            defaultValue: 0
        },
        loses: { 
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: false,
            defaultValue: 0
        },
    }, {
        timestamps: false
    });
    
    return User;
}