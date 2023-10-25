import express, { json } from "express";

import * as create from "./controllers/create"
import * as join from "./controllers/join"

export const router = express.Router();

router.get('/create', create.get)
router.post('/create', create.post)

router.get('/join/:code', join.get)
router.post('/join/:code', join.post)