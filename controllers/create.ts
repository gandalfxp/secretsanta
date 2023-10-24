import express from "express";

export async function get(req: express.Request, res: express.Response) {
    var data: any = {
        title: 'Create'
    }

    res.render('create', data);
}