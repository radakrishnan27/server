const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  confirmPassword: {
    type: String,
  },
  registeredAt: {
    type: Date,
    default: new Date(),
  },
});
accountSchema.post("validate", function (error, doc, next) {
  if (error) {
    const errors = {};
    for (let field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    next(errors);
  } else {
    next();
  }
});
const accountModel = mongoose.model("accounts", accountSchema);

module.exports = accountModel;
