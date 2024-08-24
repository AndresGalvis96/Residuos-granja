import pgPromise from "pg-promise";
import { exports } from "../config/default.js";
export default class pgService{

    constructor(){
        if(pgService.instance){
            return pgService.instance;
        }
        const pg = pgPromise({});
        this.connection=pg(exports.postgres);
        this.connection.connect()
        .then(res =>{
            console.log("conectado a base de datos");
            res.done();
        })
        .catch(error=>{
            console.log('Error', error.message )
        })
    }

}