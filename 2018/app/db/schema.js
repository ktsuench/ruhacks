const constants = require('../constants');

function emailAddressValidate(value) {
  if (typeof value === 'string') {
    //  regex email pattern match test (uses w3c pattern)
    if (value.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) !== null) {
      return true;
    }
  }

  return false;
}

function urlAddressValidate(value) {
  // https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  const pattern = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig);
  if (typeof value === 'string') {
    if (value.match(pattern)) {
      return true;
    }
  }

  return false;
}

const UserSchema = {
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    validate: {
      validator: emailAddressValidate,
    },
  },
  gender: {
    type: String,
    enum: constants.gender,
    default: constants.gender[3],
    required: true,
  },
};

const SubscriberSchema = {
  name: UserSchema.name,
  email: UserSchema.email,
  gender: UserSchema.gender,
};

const HackerSchema = {
  name: UserSchema.name,
  email: UserSchema.email,
  gender: UserSchema.gender,
  school: {
    in_school: { type: Boolean, required: true },
    name: { type: String, lowercase: true, required: this.in_school },
    program: { type: String, lowercase: true, required: this.in_school },
    year: { type: Number, required: this.in_school },
  },
  location: {
    country: { type: String, lowercase: true, required: true },
    city: { type: String, lowercase: true, required: true },
  },
  skill_experience: { type: [String], required: true },
  dietary_restriction: { type: String, default: null },
  portfolio: {
    site: { type: String, default: null, validate: { validator: urlAddressValidate } },
    repo: { type: String, default: null, validate: { validator: urlAddressValidate } },
    resume: {
      type: String,
      default: null,
      validate: { validator: urlAddressValidate },
      required: true,
    },
    other: { type: String, default: null, validate: { validator: urlAddressValidate } },
  },
  hacking: {
    experience_lvl: {
      type: String,
      enum: constants.hackathon_experience,
      default: constants.hackathon_experience[0],
      required: true,
    },
    referral_source: {
      type: String,
      enum: constants.referral_source,
      default: constants.referral_source[6],
      required: true,
    },
    why_attend: { type: String, maxlength: 300 },
    created_and_proud_of: { type: String, maxlength: 300 },
    tshirt_size: {
      type: String,
      enum: constants.tshirt_size,
      default: constants.tshirt_size[0],
      required: true,
    },
    mlh_tc_agreement: { type: Boolean, required: true },
  },
};

/**
 * @todo add in other fields later
 */
const VolunteerSchema = {
  name: UserSchema.name,
  email: UserSchema.email,
  gender: UserSchema.gender,
};

module.exports = {
  subscriber: SubscriberSchema,
  hacker: HackerSchema,
  volunteer: VolunteerSchema,
};
