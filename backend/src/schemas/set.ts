import mongoose from "mongoose";

interface Set {
    _id?: mongoose.Types.ObjectId; // Optional because MongoDB auto-generates _id
    set_id: string;
    items: mongoose.Types.ObjectId[]; // Array of references to Design documents
}

const setSchema = new mongoose.Schema<Set>({
    set_id: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Design' }] // Reference to Design documents
});

const SetModel = mongoose.model<Set>(
    "Set",
    setSchema
);
export default SetModel;
