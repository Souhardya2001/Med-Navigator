const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
      {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    metadata: {
      rewrittenQuery: String,

      model: String,

      latencyMs: Number,

      inputTokens: Number,

      outputTokens: Number,

      retrieval: {
        topK: Number,

        rerankTopK: Number,

        documents: [
          {
            documentId: String,

            chunkId: String,

            retrievalScore: Number,

            rerankScore: Number
          }
        ]
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
    "Message",
    messageSchema
);