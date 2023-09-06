export default {
  modulePathIgnorePatterns: ["<rootDir>/coverage/"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/coverage/"],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
    "<rootDir>/src/thirdparty/",
  ],
  transform: {},
};
