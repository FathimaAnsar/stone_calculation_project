import mongoose from "mongoose";

interface Stone {
    _id?: mongoose.Types.ObjectId; // Optional because MongoDB auto-generates _id
    type: string;
    size: string;
}

const stoneSchema = new mongoose.Schema<Stone>({
    type: { type: String, required: true },
    size: { type: String, required: true }
});

const StoneModel = mongoose.model<Stone>(
    "Stone",
    stoneSchema
);
export default StoneModel;
