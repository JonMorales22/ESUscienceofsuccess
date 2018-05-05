import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ResponsesSchema = new Schema({
	subject: { type: Schema.Types.ObjectId, ref: 'Subject' ,
	test: { type: Schema.Types.ObjectId, ref: 'Test'},
	TrialIndex: Number,
	QuestionIndex: Number
	data: { latency: Number, time: Number, text: String }
})

export default mongoose.model('Response', SubjectsSchema);