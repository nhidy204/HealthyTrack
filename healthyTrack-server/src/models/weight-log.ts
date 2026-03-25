import mongoose, { Document, Schema } from 'mongoose';

export interface IWeightLog extends Document {
    user: mongoose.Types.ObjectId;
    weight: number;
    date: string; 
}

const WeightLogSchema = new Schema<IWeightLog>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        weight: { type: Number, required: true, min: 20, max: 300 },
        date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    },
    { timestamps: true }
);

WeightLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IWeightLog>('WeightLog', WeightLogSchema);