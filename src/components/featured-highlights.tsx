import { initialHighlights, iconMap } from '@/lib/highlights-constants';

export function FeaturedHighlights({ dictionary }: { dictionary: any }) {
  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
            {dictionary.title}
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {dictionary.subtitle}
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
        {initialHighlights.map((highlight) => {
          const Icon = iconMap[highlight.icon];
          const highlightDict = dictionary.items[highlight.titleKey];
          return (
            <div key={highlight.id} className="grid gap-2 text-center">
              <div className="flex justify-center items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground">{highlightDict.title}</h3>
              <p className="text-sm text-muted-foreground">{highlightDict.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
