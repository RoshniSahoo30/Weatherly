import mongoose from "mongoose"

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("SearchHistory", searchHistorySchema)
