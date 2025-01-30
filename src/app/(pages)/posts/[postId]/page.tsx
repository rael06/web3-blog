export default function Page({ params }: { params: { postId: string } }) {
  return <div>Post: {params.postId}</div>;
}
