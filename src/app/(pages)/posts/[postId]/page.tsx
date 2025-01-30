type Props = { params: Promise<{ postId: string }> };

export default async function Page({ params }: Props) {
  const { postId } = await params;
  return <div>Post: {postId}</div>;
}
