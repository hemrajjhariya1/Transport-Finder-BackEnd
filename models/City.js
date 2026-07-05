import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    state: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

citySchema.virtual('id').get(function getId() {
  return this._id.toString();
});

citySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('City', citySchema);
