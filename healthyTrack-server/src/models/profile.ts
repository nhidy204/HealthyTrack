import mongoose, { Document, Schema } from 'mongoose';

export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface IProfile extends Document {
    user: mongoose.Types.ObjectId;
    gender: Gender;
    age: number;
    height: number;       
    weight: number;       
    goal: Goal;
    activityLevel: number;
    targetCalories: number;
    bmr: number;
    tdee: number;
}

const ProfileSchema = new Schema<IProfile>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        gender: { type: String, enum: ['male', 'female'], required: true },
        age: { type: Number, required: true, min: 10, max: 100 },
        height: { type: Number, required: true, min: 100, max: 250 },
        weight: { type: Number, required: true, min: 20, max: 300 },
        goal: { type: String, enum: ['lose', 'maintain', 'gain'], required: true },
        activityLevel: { type: Number, required: true },
        targetCalories: { type: Number, required: true },
        bmr: { type: Number, required: true },
        tdee: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);