const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv);

const schema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      pattern: "^[A-Z][a-z]+$",
    },
    lastName: {
      type: "string",
      pattern: "^[A-Z][a-z]+$",
    },
    email: {
      type: "string",
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
    },
    mobile: {
      type: "string",
      pattern: "^(010|012|015)\\d{8}$",
    },
    password: {
      type: "string",
      minLength: 5,
    },
  },
  required: ["firstName", "lastName", "mobile", "email", "password"],
  errorMessage: {
    type: "should be an object",
    properties: {
      firstName:
        "Registeration Failed.. First name must start with a capital letter followed by lowercase letters only.",
      lastName:
        "Registeration Failed.. Last name must start with a capital letter followed by lowercase letters only.",
      email: "Registeration Failed.. Invalid email format.",
      mobile:
        "Registeration Failed.. Mobile number must start with '010', '012', or '015', followed by 8 digits.",
      password: "Registeration Failed.. Password must be at least 5 characters long.",
    },
  },
};

module.exports = ajv.compile(schema);
