export function success(data = {}, message = "success") {
  return Response.json({
    success: true,
    message,
    data,
  });
}

export function error(message = "error", code = 500) {
  return Response.json(
    {
      success: false,
      message,
      data: null,
    },
    { status: code }
  );
}
