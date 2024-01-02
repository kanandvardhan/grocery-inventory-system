import mongoose, { Schema } from "mongoose";

const groceryItemSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

const GroceryItemModel =
  mongoose.models.GroceryItem ||
  mongoose.model("GroceryItem", groceryItemSchema);

export default GroceryItemModel;
