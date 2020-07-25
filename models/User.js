import mongoose from "mongoose";
import bcrypt from "bcrypt";

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (plainText) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  // const re = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?!.*\s)[A-Za-z\d]{8,16}$/;
  return re.test(String(plainText));
};

const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, select: false },
    name: { type: String, required: [true, "Name is required!"] },
    id: { type: String, required: [true, "Id is required!"] },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required!"],
      validate: {
        validator: validateEmail,
        message: "Please fill a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      validate: {
        validator: validatePassword,
        message:
          "Input Password and Submit [8 to 15 characters which contain at least one lowercase letter,\
            one uppercase letter, one numeric digit, and one special character]",
      },
    },
  },
  { toObject: { virtuals: true } }
);

userSchema
  .virtual("Object_Id")
  .get(function () {
    return this._id;
  })
  .set(function (value) {
    this._id = value;
  });

userSchema
  .virtual("passwordConfirmation")
  .get(function () {
    return this._passwordConfirmation;
  })
  .set(function (value) {
    if (!value) {
      this.invalidate(
        "passwordConfirmation",
        "Password Confirmation is required!"
      );
    }
    if (!this.password && value) {
      this.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
    this._passwordConfirmation = value;
  });

userSchema
  .virtual("originalPassword")
  .get(function () {
    return this._originalPassword;
  })
  .set(function (value) {
    this._originalPassword = value;
  });

userSchema
  .virtual("currentPassword")
  .get(function () {
    return this._currentPassword;
  })
  .set(function (value) {
    this._currentPassword = value;
  });

userSchema
  .virtual("newPassword")
  .get(function () {
    return this._newPassword;
  })
  .set(function (value) {
    this._newPassword = value;
  });

userSchema.path("password").validate(function (password) {
  var user = this;
  // 회원정보 생성
  if (user.isNew) {
    // 원본 비밀번호 값과 확인 비밀번호 값이 다를 경우
    if (password !== user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
  }
  // 회원정보 수정
  if (!user.isNew) {
    // 현재 비밀번호를 입력 안했을 때
    if (!user.currentPassword) {
      user.invalidate("currentPassword", "Current Password is required!");
    }
    // 사용자가 입력한 비밀번호와 실제 DB에 저장된 비밀번호가 다를 때
    else if (user.currentPassword !== user.originalPassword) {
      user.invalidate("currentPassword", "Current Password is invalid!");
    }
    // 새로 입력한 비밀번호와 그 비밀번호를 확인하는 입력한 비밀번호가 다를 때
    if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
  }
});

userSchema.path("email").validate(async function (email) {
  try {
    const self = this;
    const user = await self.constructor.findOne({ email: email });
    if (user) {
      if (user.id === self.id) {
        self.invalidate("email", "The email address is already taken!");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

userSchema.pre("save", function (next) {
  const user = this;
  user.Object_Id = new mongoose.Types.ObjectId();
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.method.comparePassword = function (plainText, callbackFn) {
  bcrypt.compare(plainText, this.password, function (err, isMatch) {
    if (err) return cb(err);
    callbackFn(null, isMatch);
  });
  return callbackFn(null, bcrypt.compareSync(plainText, this.password));
};

const User = mongoose.model("User", userSchema);
export default User;
