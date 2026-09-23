import mongoose from "mongoose";

const zoomMeetingSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: Number,
            default: 2,
        },
        start_time: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },
        password: {
            type: String,
            trim: true,
        },
        agenda: {
            type: String,
            trim: true,
        },
        meeting_id: {
            type: String,
            required: true,
        },
        join_url: {
            type: String,
            required: true,
        },
        start_url: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: false,
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurrence: {
            type: {
                type: Number,
            },
            repeat_interval: {
                type: Number,
            },
            weekly_days: {
                type: String,
            },
            monthly_day: {
                type: Number,
            },
            monthly_week: {
                type: Number,
            },
            monthly_week_day: {
                type: Number,
            },
            end_times: {
                type: Number,
            },
            end_date_time: {
                type: Date,
            },
        },
    },
    { timestamps: true }
);

zoomMeetingSchema.index({ courseId: 1, start_time: -1 });

const ZoomMeeting = mongoose.models.ZoomMeeting || mongoose.model("ZoomMeeting", zoomMeetingSchema);

export default ZoomMeeting;
