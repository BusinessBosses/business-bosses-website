'use client';
import { useRouter } from "next/navigation";
import RoutesPath from "../../../../constants/Routes";

export default function Loginsection() {
  const router = useRouter();
  return (
    <section className="py-20 text-black bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to rank up your business?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already using our demand engine.
        </p>
        <div className="flex justify-center">
          <button
            className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold"
            onClick={() => window.location.href = "https://businessbosses.onelink.me/xLWk/36a2ff16"}
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
