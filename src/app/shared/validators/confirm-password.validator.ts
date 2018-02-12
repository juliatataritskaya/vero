export function validateConfirmPassword (group: any): any {
  const password = group.get('password').value;
  const confirmPassword = group.get('confirmPassword').value;
  if (password && !confirmPassword) {
    group.controls['confirmPassword'].setErrors({uninvited: true});
  }
  if (!password && confirmPassword) {
    group.controls['password'].setErrors({uninvited: true});
  }
  if (password !== confirmPassword) {
    group.controls['confirmPassword'].setErrors({invalidConfirmPassword: true});
  } else {
    return null;
  }
}
