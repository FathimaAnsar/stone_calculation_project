import mongoose from "mongoose";

// Define an interface for the structure of each item in the stones_amnt array
interface StoneRequirement {
    type?: string; // Optional type of stone
    size?: string; // Optional size of the stones
    quantity?: string; // Optional quantity of the stone required
}

// Define the main interface for the Design document
interface Design {
    _id?: mongoose.Types.ObjectId; // Optional because MongoDB auto-generates _id
    cat_code:string;
    design_id: string;
    set_id:string;
    type: string;
    stones_amnt: StoneRequirement[]; // Array of StoneRequirement objects
    silver_quantity: string;
}

// Define the schema for the Design document
const designSchema = new mongoose.Schema<Design>({
    cat_code: { type: String, required: true },
    design_id: { type: String, required: true },
    set_id: { type: String, required: true },
    type: { type: String, required: true },
    stones_amnt: [{
        type: { type: String }, // Optional type of stone
        size: { type: String },
        quantity: { type: String } // Optional quantity of the stone required
    }],
    silver_quantity: { type: String, required: true },
});

// Create the Mongoose model for Designs
const DesignModel = mongoose.model<Design>(
    'Design',
    designSchema
);

export default DesignModel;
