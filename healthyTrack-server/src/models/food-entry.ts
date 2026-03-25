import mongoose, { Document, Schema } from 'mongoose';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface IFoodEntry extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    amount: string;
    calories: number;
    mealType: MealType;
    date: string;       
}

const FoodEntrySchema = new Schema<IFoodEntry>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true, trim: true },
        amount: { type: String, required: true, trim: true },
        calories: { type: Number, required: true, min: 0 },
        mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
        date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    },
    { timestamps: true }
);

// Index for fast queries by user + date
FoodEntrySchema.index({ user: 1, date: 1 });

export default mongoose.model<IFoodEntry>('FoodEntry', FoodEntrySchema);