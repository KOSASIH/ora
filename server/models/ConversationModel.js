import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);
var schema = new mongoose.Schema({
  members: {
    type: Array,
  },
}, {
  timestamps: true
})
export const ConversationModel = mongoose.model('Conversation', schema)