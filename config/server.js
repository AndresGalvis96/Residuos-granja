import express from "express";
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';
import router from "../routes/index.routes.js";
import jwt from 'jsonwebtoken';
import middle from '../middlewares/index.middleware.js'
import pgService from "../services/pg.services.js";
import { exports } from "./default.js";
import { login } from '../controller/auth.controller.js';
export default class Server{

    constructor(){

        this.app=express();
        this.port= exports.port
    }
    async conecctionDb(){
        new pgService();
    }

    middleware(){
        this.app.use(bodyParser.json());
        this.app.use(middle);
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.set('view engine', 'ejs');
        this.app.use(express.static('views'));
   
    }
    
    routes(){

        const verificarToken = (req, res, next) => {
            const token = req.cookies.token;

            if (!token) {
                return res.redirect('/');
            }

            try {
                const decoded = jwt.verify(token, exports.secret);
                req.token = token;
                next();
            } catch (error) {
                console.error('Error de autenticación:', error);
                return res.status(401).send('Acceso no autorizado');
            }
        };
        this.app.use(express.urlencoded({ extended: true }));


        this.app.post('/auth/login', login);


        this.app.use(router);
        this.app.get("/animales", verificarToken, (req, res) => {

            res.render("animales", { title: 'Animales', token: req.token });
        });

        this.app.get("/residuos", verificarToken, (req, res) => {
            // Ahora puedes acceder al token a través de req.token
            res.render('waste', { token: req.token });
        });
        this.app.get('/', (req, res) => {
            res.render('index', { title: 'Página de inicio' });
        });

        this.app.get('/bienvenido', (req, res) => {

            const token = req.cookies.token;

            if (!token) {
                return res.redirect('/');
            }

            try {

                const decoded = jwt.verify(token, exports.secret);

                res.render('bienvenido', { title: '¡Bienvenido!', token: token });
            } catch (error) {
                console.error('Error de autenticación:', error);
                return res.status(401).send('Acceso no autorizado');
            }
        });

    }

    runserver(){
        this.app.listen(this.port ,()=>{
            console.log("Corriendo en puerto: ", this.port)
        })
    }

    load(){
        this.conecctionDb();
        this.middleware();
        this.routes();
        this.runserver();
    }
}