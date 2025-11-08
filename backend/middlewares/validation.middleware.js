const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('email')
    .isEmail().withMessage('Invalid Email')
    .normalizeEmail(),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/)
    .withMessage('Password phải ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'),
  body('role')
    .optional()
    .isIn(['customer', 'admin']).withMessage('Invalid Role'),
  body('fname')
    .matches(/^[A-Za-zÀ-ỹ\s]+$/)
    .withMessage('First name chỉ được chứa chữ cái'),
  body('lname')
    .matches(/^[A-Za-zÀ-ỹ\s]+$/)
    .withMessage('First name chỉ được chứa chữ cái'),

  // Middleware xử lý kết quả
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegister };