import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SubjectsSchema = new Schema({
	age: Number,
	year: String,
	ethnicity: String
}, { timestamps: true });

export default mongoose.model('Subject', SubjectsSchema);