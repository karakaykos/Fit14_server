const mysql = require('mysql');

/**
 * MySql connection
 * 
 * @class Connection
 */
class Connection {
    /**
     * Gets connection to mysql db
     * 
     * @readonly
     * @static
     * @memberof Connection
     */
    static get() {
        return mysql.createConnection({
            host: "http://46.101.42.158/",
            user: "root",
            password: "CherryPie_26112015",
            database: "fit24"
        });
    }
}
module.exports = Connection;