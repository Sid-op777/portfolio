import Image from "next/image"; 

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-10 px-6">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        {/* Light theme logo */}
        <Image
          src="/nx7 (dark).svg"
          alt="Logo"
          width={150}
          height={40}
          className="block dark:hidden h-10 w-auto"
        />

        {/* Dark theme logo */}
        <Image
          src="/nx7 (light).svg"
          alt="Logo"
          width={150}
          height={40}
          className="hidden dark:block h-10 w-auto"
        />
      </div>
    </footer>
  );
}