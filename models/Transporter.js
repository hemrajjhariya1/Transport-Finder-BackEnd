import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    frequency: String,
    transitDays: String,
  },
  { _id: false }
);

const transporterSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    yearsInBusiness: { type: Number, default: 0 },
    memberSince: { type: String, trim: true },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    vehicleTypes: [{ type: String, trim: true }],
    services: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    routes: { type: [routeSchema], default: [] },
  },
  { timestamps: true }
);

transporterSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

transporterSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Transporter', transporterSchema);
