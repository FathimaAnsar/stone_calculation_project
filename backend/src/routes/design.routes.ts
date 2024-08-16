import express, { Request, Response } from "express";
import DesignModel from '../schemas/designs';
const designRouter = express.Router();
//get all
designRouter.get("/get", async (req: Request, res: Response) => {
    try {
        const design = await DesignModel.find({});
        if (!design || design.length === 0) {
            return res.status(404).json({ message: "No designs found" });
        }
        res.status(200).json(design);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get by id
designRouter.get("/get/:design_id", async (req: Request, res: Response) => {
    try {
        const design_id = req.params.design_id;
        const design = await DesignModel.findOne({ design_id: design_id });
        if (!design) {
            return res.status(404).json({ message: "Design ID not found" });
        }
        res.status(200).json(design);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
//create
designRouter.post("/add", async (req: Request, res: Response) => {
    try {
        const newRecordBody = req.body;
        const newRecord = new DesignModel(newRecordBody);
        const savedRecord = await newRecord.save();

        res.status(200).send({message:"Design has been added successfully!",savedRecord});
    } catch (err) {
        res.status(500).send(err);
    }
});
//update
designRouter.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = await DesignModel.findByIdAndUpdate(
            id,
            newRecordBody,
            { new: true }
        );
        if (!record) return res.status(404).send();

        res.status(200).send({message: "Design has been updated."});
    } catch (err) {
        res.status(500).send(err);
    }
});
//delete
designRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const record = await DesignModel.findByIdAndDelete(id);
        if (!record) return res.status(404).send();
        res.status(200).send({message: "Design has been deleted successfully."});
    } catch (err) {
        res.status(500).send(err);
    }
});
export default designRouter;