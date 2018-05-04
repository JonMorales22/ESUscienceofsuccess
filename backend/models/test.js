import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TestsSchema = new Schema({
  name: String,
  numOfTrials: Number,
  numOfQuestions: Number
}, { timestamps: true });

export default mongoose.model('Test', TestsSchema);