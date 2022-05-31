export const serverConfig = {
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  db: {
    link: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.${process.env.DB_CLUSTER_URL}/?retryWrites=true&w=majority`,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
