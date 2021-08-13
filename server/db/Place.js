const {Sequelize, VIRTUAL} = require('sequelize');
const {STRING, ENUM} = Sequelize;
const db = require('./db');

const Place = db.define('place', {
    place_name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    category: {
        type: ENUM('CITY', 'STATE','COUNTRY'),
        defaultValue: 'STATE',
        allowNull: false
    },
    isState: {
        type: VIRTUAL,
        get() {
            return this.category === 'STATE';
        }
    },
    nickname: {
        type: VIRTUAL,
        get() {
            return this.place_name.split(' ').map(word => word[0].toUpperCase()).join('');
        }
    }
});


/**
 * We've created the association for you!
 *
 * A place can be related to another place:
 *       NY State (parent)
 *         |
 *       /   \
 *     NYC   Albany
 * (child)  (child)
 *
 * You can find the parent of a place and the children of a place 
 */

Place.belongsTo(Place, { as: 'parent' });
Place.hasMany(Place, { as: 'children', foreignKey: 'parentId' });

//parentId will be added to Place
//childrenId will be added to Place with the foreignKey of parentId

//foreign key will be in place w alias childrenId using foreign key parentId?

Place.findCitiesWithNoParent = function(){
    return this.findAll({
        where: {
            category: 'CITY',
            parentId: null
        }
    });    
}

Place.findStatesWithCities = function(){
    return this.findAll({
        where: {
            category: 'STATE'
        },
        include: {
            model: Place,
            as: 'children'
        }
    });
}

module.exports = Place;
