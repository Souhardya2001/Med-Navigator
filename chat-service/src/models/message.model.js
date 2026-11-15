const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true, trim: true, maxlength: 10000 },
    status: {
      type: String,
      required: true,
      enum: ["COMPLETED"],
      default: "COMPLETED",
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

messageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
