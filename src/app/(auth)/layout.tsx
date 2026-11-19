export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white sm:bg-[#F8FAFC] py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}
