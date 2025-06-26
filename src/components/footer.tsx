export function Footer({ dictionary }: { dictionary: any }) {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-primary/20 bg-black">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          {dictionary.copyright.replace('{year}', new Date().getFullYear())}
        </p>
      </div>
    </footer>
  );
}
