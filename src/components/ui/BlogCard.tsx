import Link from "next/link";
import Image from "next/image";
export default function BlogCard() {
  return (
    <Link
      href="#"
      className="flex flex-row border-t-1 border-[var(--border-color)] p-6 w-full shadow-inset-md hover:shadow-lg hover:bg-gray-200"
    >
      <div className="h-32 w-32 border-2 rounded-lg overflow-hidden">
        <img
          src="ado.jpg"
          alt="Blog Post Image"
          className="h-full object-fill"
        />
      </div>
      <div className="ml-4 flex-1">
        <h2 className="text-2xl font-semibold mb-2">Blog Post Title</h2>
        <p className="text-gray-600 mb-4">
          A brief summary of the blog post content goes here. It should be
          engaging and informative to entice readers to click through.
        </p>
      </div>
    </Link>
  );
}
