import mongoose from 'mongoose';
const Schema = mongoose.Schema;

function validateArray(arr) {
	if(arr.length>0==false)
		return false;
	else
		return true;
}

const TestsSchema = new Schema({
  name: String,
  trials: [{ type: Number, type: String}],
  questions: [{ type: Number, type: String}]
}, { timestamps: true });

export default mongoose.model('Test', TestsSchema);