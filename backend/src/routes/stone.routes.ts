import express, { Request, Response } from "express";
import StoneModel from "../schemas/stones";
const stoneRouter = express.Router();

//get all
stoneRouter.get("/get", async (req: Request, res: Response) => {
    try {
        const stone = await StoneModel.find({});
        if (!stone || stone.length === 0) {
            return res.status(404).json({ message: "No designs found" });
        }
        res.status(200).json(stone);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get by id
stoneRouter.get("/get/:_id", async (req: Request, res: Response) => {
    try {
        const _id = req.params._id;
        const stone = await StoneModel.find({ _id: _id });
        if (!stone) {
            return res.status(404).json({ message: "Stone ID not found" });
        }
        res.status(200).json(stone);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//create new
stoneRouter.post("/add", async (req: Request, res: Response) => {
    try {
        const newRecordBody = req.body;
        const newRecord = new StoneModel(newRecordBody);
        const savedRecord = await newRecord.save();

        res.status(200).send({message:"Stone has been added successfully!",savedRecord});
    } catch (err) {
        res.status(500).send(err);
    }
});

//update
stoneRouter.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = await StoneModel.findByIdAndUpdate(
            id,
            newRecordBody,
            { new: true }
        );
        if (!record) return res.status(404).send();
        res.status(200).send({message: "Stone has been updated."});
    } catch (err) {
        res.status(500).send(err);
    }
});

//delete
stoneRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const record = await StoneModel.findByIdAndDelete(id);
        if (!record) return res.status(404).send();
        res.status(200).send({message: "Stone has been deleted successfully."});
    } catch (err) {
        res.status(500).send(err);
    }
});

export default stoneRouter;
