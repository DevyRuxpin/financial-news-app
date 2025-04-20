const {
  validateRegister,
  validateLogin,
  validateArticle
} = require('../middleware/validationMiddleware');

describe('Validation Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validateRegister', () => {
    it('should pass validation with valid data', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123'
      };

      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail validation with invalid email', async () => {
      mockReq.body = {
        email: 'invalid-email',
        password: 'Password123'
      };

      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please enter a valid email'
          })
        ])
      });
    });

    it('should fail validation with weak password', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'weak'
      };

      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: expect.stringContaining('Password must be')
          })
        ])
      });
    });
  });

  describe('validateLogin', () => {
    it('should pass validation with valid data', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123'
      };

      await validateLogin[0](mockReq, mockRes, mockNext);
      await validateLogin[1](mockReq, mockRes, mockNext);
      await validateLogin[2](mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail validation with missing password', async () => {
      mockReq.body = {
        email: 'test@example.com'
      };

      await validateLogin[1](mockReq, mockRes, mockNext);
      await validateLogin[2](mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Password is required'
          })
        ])
      });
    });
  });

  describe('validateArticle', () => {
    it('should pass validation with valid data', async () => {
      mockReq.body = {
        title: 'Test Article',
        url: 'https://example.com',
        source: 'Test Source'
      };

      await validateArticle[0](mockReq, mockRes, mockNext);
      await validateArticle[1](mockReq, mockRes, mockNext);
      await validateArticle[2](mockReq, mockRes, mockNext);
      await validateArticle[3](mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail validation with invalid URL', async () => {
      mockReq.body = {
        title: 'Test Article',
        url: 'invalid-url',
        source: 'Test Source'
      };

      await validateArticle[1](mockReq, mockRes, mockNext);
      await validateArticle[3](mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please enter a valid URL'
          })
        ])
      });
    });

    it('should fail validation with missing required fields', async () => {
      mockReq.body = {};

      await validateArticle[0](mockReq, mockRes, mockNext);
      await validateArticle[3](mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Title is required'
          })
        ])
      });
    });
  });
}); 