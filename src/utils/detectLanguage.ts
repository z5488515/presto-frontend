export const detectLanguage = (code: string): string => {
  if (
    code.includes('#include') ||
    code.includes('int main') ||
    code.includes('printf') ||
    code.includes('scanf')
  ) return 'c';

  if (
    code.includes('def ') ||
    code.includes('import ') && !code.includes('{') ||
    code.includes('print(') ||
    code.includes('elif ')
  ) return 'python';

  return 'javascript';
};