// Constants
const { EMAIL_DOMAIN, MIN_USER_AGE } = require("../util/constants");

// Moderation
const { moderateMessage } = require("../util/moderation");

// Age
const { age } = require("../util/helpers");

// Checks if param is empty
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

// Checks if param is valid email syntax
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const domainLength = EMAIL_DOMAIN.length;
  const submittedLength = email.length;
  if (
    email.match(emailRegEx) &&
    email.substring(submittedLength - domainLength, submittedLength) === EMAIL_DOMAIN
  )
    return true;
  else return false;
};

// Validate Signup Data
exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid Cedarville email address";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords must match";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validate Change Password
exports.validatePassword = (data) => {
  let errors = {};

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords must match";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validate Login Data
exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateUserProfile = (data) => {
  let userProfile = {};
  let errors = {};

  // Display Name - Required
  if (typeof data.name === "undefined" || isEmpty(data.name.trim()))
    errors.name = "Must specify a display name";
  else userProfile.name = data.name;

  // Gender - Required
  if (typeof data.gender === "undefined" || isEmpty(data.gender.trim()))
    errors.gender = "Must not be empty";
  else userProfile.gender = data.gender;

  // Birthday - Required
  if (typeof data.birthday === "undefined" || isEmpty(data.birthday.trim()))
    errors.birthday = "Required so we can display your age";
  else if (age(data.birthday) < MIN_USER_AGE)
    errors.birthday = "Please specify a valid birthday so we can display your age";
  else userProfile.birthday = data.birthday;

  // Graduation Year - Required
  if (typeof data.year === "undefined" || isEmpty(data.year.trim()))
    errors.year = "Must not be empty";
  else userProfile.year = data.year;

  // Major
  if (typeof data.major !== "undefined" && !isEmpty(data.major.trim()))
    userProfile.major = data.major;

  // Hometown
  if (typeof data.hometown !== "undefined") userProfile.hometown = data.hometown;

  // About
  if (typeof data.about !== "undefined") userProfile.about = moderateMessage(data.about);

  // Interests
  if (typeof data.interests !== "undefined") userProfile.interests = data.interests;

  // Occupation
  if (typeof data.occupation !== "undefined") userProfile.occupation = data.occupation;

  // Website
  if (typeof data.website !== "undefined") {
    // https://website.com
    if (data.website !== "" && data.website.trim().substring(0, 4) !== "http") {
      userProfile.website = `http://${data.website.trim()}`;
    } else userProfile.website = data.website;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
    userProfile,
  };
};

exports.validateUserSettings = (data) => {
  let userSettings = {};
  let errors = {};

  // Visibility
  if (typeof data.visible !== "undefined") userSettings.visible = data.visible;

  // Email Preferences
  if (typeof data.emails !== "undefined") userSettings.emails = data.emails;

  // Premium Settings

  // Premium
  if (typeof data.premium !== "undefined") userSettings.premium = data.premium;

  // Boost
  if (typeof data.boost !== "undefined")
    if (data.premium) userSettings.boost = data.boost;
    else if (data.boost === true) errors.boost = "Requires premium";

  // Recycle
  if (typeof data.recycle !== "undefined")
    if (data.premium) userSettings.recycle = data.recycle;
    else if (data.recycle === true) errors.recycle = "Requires premium";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
    userSettings,
  };
};

exports.validateReportDetails = (data) => {
  let errors = {};

  // Display Name - Required
  if (typeof data.reason === "undefined" || isEmpty(data.reason.trim()))
    errors.reason = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
