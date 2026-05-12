import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['scheduling', 'memory', 'deadlock', 'disk', 'filesystem'], required: true },
  config: { type: mongoose.Schema.Types.Mixed },
  results: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model('Simulation', simulationSchema);
