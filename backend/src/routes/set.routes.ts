import express, { Request, Response } from "express";
import SetModel from "../schemas/set";
const setRouter = express.Router();

//get all
setRouter.get("/get", async (req: Request, res: Response) => {
    try {
        const set = await SetModel.find({});
        if (!set || set.length === 0) {
            return res.status(404).json({ message: "No sets found" });
        }
        res.status(200).json(set);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get by id
setRouter.get("/get/:_id", async (req: Request, res: Response) => {
    try {
        const _id = req.params._id;
        const set = await SetModel.find({ _id: _id });
        if (!set) {
            return res.status(404).json({ message: "set ID not found" });
        }
        res.status(200).json(set);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//create new
setRouter.post("/add", async (req: Request, res: Response) => {
    try {
        const newRecordBody = req.body;
        const newRecord = new SetModel(newRecordBody);
        const savedRecord = await newRecord.save();

        res.status(200).send({message:"set has been added successfully!",savedRecord});
    } catch (err) {
        res.status(500).send(err);
    }
});

//update
setRouter.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = await SetModel.findByIdAndUpdate(
            id,
            newRecordBody,
            { new: true }
        );
        if (!record) return res.status(404).send();
        res.status(200).send({message: "set has been updated."});
    } catch (err) {
        res.status(500).send(err);
    }
});

//delete
setRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const record = await SetModel.findByIdAndDelete(id);
        if (!record) return res.status(404).send();
        res.status(200).send({message: "set has been deleted successfully."});
    } catch (err) {
        res.status(500).send(err);
    }
});

export default setRouter;
