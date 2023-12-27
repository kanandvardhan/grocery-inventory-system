import { Navbar } from "./_components/navbar";

interface MainLayoutProps {
  params: { username: string };
  children: React.ReactNode;
}

const CreatorLayout = async ({ children }: MainLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="flex h-full pt-20 items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default CreatorLayout;
