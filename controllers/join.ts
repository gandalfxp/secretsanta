import express from "express";

export async function get(req: express.Request, res: express.Response) {
    res.render('join')
}