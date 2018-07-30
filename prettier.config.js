module.exports = {
  useTabs: false, // Indent lines with tabs instead of spaces.
  printWidth: 100, // Specify the length of line that the printer will wrap on.
  tabWidth: 2, // Specify the number of spaces per indentation-level.
  singleQuote: true, // Use single quotes instead of double quotes.
  bracketSpacing: true, // Print spaces between brackets in object literals.
  arrowParens: 'always', // Include parentheses around a sole arrow function parameter.
  /**
   * Print trailing commas wherever possible.
   * Valid options:
   *   - "none" - no trailing commas
   *   - "es5" - trailing commas where valid in ES5 (objects, arrays, etc)
   *   - "all" - trailing commas wherever possible (function arguments)
   */
  trailingComma: 'none',
  /**
   * Specify which parse to use.
   * Valid options:
   *   - "flow"
   *   - "babylon"
   */
  parser: 'babylon'
};
