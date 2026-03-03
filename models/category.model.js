import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      minLength: [3, "Category name must be at least 3 characters long"],
      maxLength: [50, "Category name must be less than 50 characters long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
// // Auto-generate slug from name
// categorySchema.pre("validate", async function () {
//   // Check if name is modified to avoid unnecessary processing
//   if (!this.isModified("name")) {
//     this.slug = slugify(this.name, { lower: true });
//   }
// });
export const categoryModel = mongoose.model("Category", categorySchema);
