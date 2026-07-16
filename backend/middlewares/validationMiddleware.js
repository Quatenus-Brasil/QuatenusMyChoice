const validate = (schema) => (request, response, next) => {
  const result = schema.safeParse(request.body);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    console.log(result.error)
    return response.status(400).json({ success: false, message });
  }

  request.body = result.data;
  next();
};

export { validate };