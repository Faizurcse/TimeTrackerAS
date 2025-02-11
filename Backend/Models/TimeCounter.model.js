import mongoose from "mongoose";

const TimeTrackingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique in the collection
    },
    BreakTime: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        required: true
    },
    idleMsg: {
        type: [String],
    },
    WorkTime: {
        type: Number,
        default: 0
    },

    totalIdleTime:{
        type: Number,
        default: 0
    },

    loginAt:{
        type: String,
        default: 0
    },

}, { timestamps: true });


export default mongoose.model("TimeTrackingModal",TimeTrackingSchema);