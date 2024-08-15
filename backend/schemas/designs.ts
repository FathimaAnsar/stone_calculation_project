import mongoose from "mongoose";

// Define an interface for the structure of each item in the stones_amnt array
interface StoneRequirement {
    stone_id: mongoose.Schema.Types.ObjectId; // Reference to a Stone document
    quantity: number; // Quantity of the stone required
}

// Define the main interface for the Design document
interface Design {
    _id?: mongoose.Types.ObjectId; // Optional because MongoDB auto-generates _id
    design_id: number;
    type: string;
    stones_amnt: StoneRequirement[]; // Array of StoneRequirement objects
    silver_quantity: number;
}

// Define the schema for the Design document
const designSchema = new mongoose.Schema<Design>({
    design_id: { type: Number, required: true },
    type: { type: String, required: true },
    stones_amnt: [{
        stone_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stone' }, // Reference to a Stone document
        quantity: { type: Number, required: true } // Quantity of the stone required
    }],
    silver_quantity: { type: Number, required: true },
});

// Create the Mongoose model for Designs
const DesignModel = mongoose.model<Design>(
    'Design',
    designSchema
);

export default DesignModel;
