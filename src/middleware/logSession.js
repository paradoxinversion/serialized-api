export default async function logSession(req, res, next) {
  console.log("Log::", req.session);
  next();
}
