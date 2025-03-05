export const PATTERN = {
  phone: '^(\\+84|84|0[3|5|7|8|9])+([0-9]{8,18})\\b$',
  email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  code: '^[A-Z0-9_]*$',
  codeFontEnd: '^[a-zA-Z0-9_]*$',
  username: '^[a-zA-Z0-9]+$',
  domain: '^[a-z0-9.-]+\\.[a-z]{2,4}$',
  url: '^(https|http)?://(www){0,1}.+[a-z0-9.-]+\\.[a-z]{2,4}.*$',
  password: '^\\S.*[^.\\s]$',
};
