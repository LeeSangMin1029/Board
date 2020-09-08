import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required!"] },
    id: { type: String, required: [true, "Id is required!"] },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { toObject: { virtuals: true } }
);

userSchema
  .virtual("passwordConfirmation")
  .get(function () {
    return this._passwordConfirmation;
  })
  .set(function (value) {
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

userSchema.path("password").validate(async function (v) {
  var user = this;
  const passwordRegexCheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  // 회원정보 생성
  if (user.isNew) {
    if (!user.password) {
      user.invalidate("password", "Password is required!");
    }
    if (!user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation is required!"
      );
    }

    // 원본 비밀번호 값과 확인 비밀번호 값이 다를 경우
    if (user.password !== user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
    if (!passwordRegexCheck.test(String(user.password))) {
      user.invalidate(
        "password",
        "8 to 15 characters which contain at least one lowercase letter\n\
one uppercase letter, one numeric digit, and one special character"
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
    else if (
      !(await bcrypt.compare(user.currentPassword, user.originalPassword))
    ) {
      user.invalidate("currentPassword", "Current Password is invalid!");
    }
    // 새로운 비밀번호 값이 있을 때
    if (user.newPassword) {
      // 다시 확인하는 비밀번호 값이 없을 때
      if (!user.passwordConfirmation) {
        user.invalidate(
          "passwordConfirmation",
          "Confirm Password is required!"
        );
      }
      // 새로 입력한 비밀번호와 그 비밀번호를 확인하는 입력한 비밀번호가 다를 때
      if (user.newPassword !== user.passwordConfirmation) {
        user.invalidate(
          "passwordConfirmation",
          "Password Confirmation does not matched!"
        );
      }
      // 새로운 비밀번호의 값이 정규식 검사
      if (!passwordRegexCheck.test(String(user.newPassword))) {
        user.invalidate(
          "newPassword",
          "8 to 15 characters which contain at least one lowercase letter \
          one uppercase letter, one numeric digit, and one special character"
        );
      }
    }
  }
});

userSchema.path("email").validate(async function (email) {
  try {
    const self = this;
    const emailRegexCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegexCheck.test(String(email).toLowerCase())) {
      self.invalidate("email", "The email address invalid");
    }
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

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  else {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (err) {
      console.error(err);
    }
  }
});

userSchema.methods.authenticate = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("User", userSchema);
export default User;
