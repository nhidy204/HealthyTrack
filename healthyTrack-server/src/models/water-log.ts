import mongoose, { Document, Schema } from 'mongoose';

export interface IWaterLog extends Document {
    user: mongoose.Types.ObjectId;
    glasses: number;
    date: string;   
}

const WaterLogSchema = new Schema<IWaterLog>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        glasses: { type: Number, required: true, min: 0, max: 20 },
        date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    },
    { timestamps: true }
);

WaterLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IWaterLog>('WaterLog', WaterLogSchema);