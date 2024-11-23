'use server';

const SERVER = process.env.NEXT_PUBLIC_SERVER_API_URL;

export default async function createReviewAction(formData: FormData) {
  const movieId = formData.get('movieId')?.toString();
  const content = formData.get('content')?.toString();
  const author = formData.get('author')?.toString();

  if (!movieId || !content || !author) return;

  try {
    const response = await fetch(`${SERVER}/review`, {
      method: 'POST',
      body: JSON.stringify({ movieId, content, author }),
    });
    console.log(response);
  } catch (err) {
    console.error(err);
    return;
  }
}
