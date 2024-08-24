import {checkSchema} from "express-validator";

export const productValidator = checkSchema({ 
    nombre:{ 
        errorMessage: "Nombre requerido",
        matches : { options: /[0-9]/}
    } 

}, ["query"]);