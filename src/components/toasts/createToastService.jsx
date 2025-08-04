// toastService.js
export const createToastService = (toastRef) => {
  const showSuccess = (detail = 'Operación exitosa') => {
    toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail, life: 3000 });
  };

  const showInfo = (detail = 'Información general') => {
    toastRef.current?.show({ severity: 'info', summary: 'Info', detail, life: 3000 });
  };

  const showWarn = (detail = 'Advertencia') => {
    toastRef.current?.show({ severity: 'warn', summary: 'Advertencia', detail, life: 3000 });
  };

  const showError = (detail = 'Ocurrió un error') => {
    toastRef.current?.show({ severity: 'error', summary: 'Error', detail, life: 3000 });
  };

  return { showSuccess, showInfo, showWarn, showError };
};
