export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
