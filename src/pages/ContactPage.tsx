export function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-8">
      <h1 className="editorial-title mb-8">Contact</h1>
      <div className="grid gap-6 border border-hairline bg-panel p-6 md:grid-cols-2">
        <div>
          <p className="caption">Client Services</p>
          <p className="text-[1.4rem]">support@illyrianbloodline.com</p>
        </div>
        <div>
          <p className="caption">Press</p>
          <p className="text-[1.4rem]">press@illyrianbloodline.com</p>
        </div>
      </div>
    </main>
  );
}
