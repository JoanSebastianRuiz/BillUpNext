const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const isValidLength = (value: string, maxLength: number): boolean => {
  return value.length > 0 && value.length <= maxLength;
}

const isValidPhoneNumber = (phone: string): boolean => {
  const regex = /^\d{10}$/;
  return regex.test(phone);
}

const isValidDocument = (document: string): boolean => {
  const regex = /^\d{8,10}$/;
  return regex.test(document);
}

const isValidNit = (nit: string): boolean => {
  const regex = /^\d{9}$/;
  return regex.test(nit);
}

const isValidDigitoVerificacion = (nit: string): boolean => {
  const regex = /^\d{1}$/;
  return regex.test(nit);
}

const isValidCodigoPostal = (codigoPostal: string): boolean => {
  const regex = /^\d{6}$/;
  return regex.test(codigoPostal);
}

// Verifica que sea un número positivo, con o sin decimales
const isValidDinero = (Dinero: string): boolean => {
  const regex = /^(0|[1-9]\d*)(\.\d+)?$/;
  return regex.test(Dinero);
};

const isValidNum = (num: string): boolean => {
  const regex = /^\d+$/;
  return regex.test(num) && Number(num) >= 0;
};

const isValidPercent = (percent: string): boolean => {
  const regex = /^(100|[1-9]?\d)(\.\d+)?$/; // Permite números entre 0 y 100, con decimales
  return regex.test(percent) && Number(percent) >= 0 && Number(percent) <= 100;
};

const isValidPassword = (password: string): boolean => {
  const minLength = 8;

  // Verificar longitud
  if (password.length < minLength || password.length > 250) {
    return false;
  }

  // Verificar al menos una letra mayúscula
  const hasUpperCase = /[A-Z]/.test(password);

  // Verificar al menos una letra minúscula
  const hasLowerCase = /[a-z]/.test(password);

  // Verificar al menos un número
  const hasNumber = /\d/.test(password);

  // Verificar al menos un carácter especial
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Verificar que no tenga espacios en blanco
  const hasNoSpaces = !/\s/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasNoSpaces;
};

const isValidStock = (stockMinimo: number, stockMaximo: number): boolean => {
  return stockMinimo > 0 && stockMaximo > 0 && stockMinimo <= stockMaximo;
}

export { isValidEmail, isValidPhoneNumber, isValidDocument, isValidPassword, isValidNit, isValidDigitoVerificacion, isValidCodigoPostal, isValidLength, isValidDinero, isValidNum, isValidPercent, isValidStock };