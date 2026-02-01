export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Demo auth (hardcoded for now)
  if (email === 'Klemen.witwicky@gmail.com' && password === 'Icky44ewa') {
    return Response.json({
      user: { id: 1, email }
    });
  }

  return Response.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
