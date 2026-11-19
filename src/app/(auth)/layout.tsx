export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-start sm:justify-center items-center bg-white sm:bg-[#F8FAFC] p-0 sm:py-8 sm:px-4">
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}
