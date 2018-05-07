import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ResponsesSchema = new Schema({
	subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
	testId: { type: Schema.Types.ObjectId, ref: 'Test'},
	trialIndex: Number,
	questionIndex: Number,
	data: { latency: Number, time: Number, text: String },
});

export default mongoose.model('Response', ResponsesSchema);