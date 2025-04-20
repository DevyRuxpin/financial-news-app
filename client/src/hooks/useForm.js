import { useState, useCallback } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, validate]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [values, validate]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] && errors[name],
    helperText: touched[name] && errors[name]
  }), [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    validateForm,
    getFieldProps,
    setValues,
    setErrors,
    setTouched
  };
};

export default useForm; 