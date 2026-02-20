import { cn } from "@/lib/utils";

import { Logo, LogoImage, LogoText } from "@/components/shadcnblocks/logo";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "/assets/logoImage.ico",
    alt: "Khabo logo",
    title: "Khabo",
    url: "/",
  },
  className,
  tagline = "Connecting homemade flavors with your doorstep.",
  menuItems = [
    {
      title: "Navigate",
      links: [
        { text: "Home", url: "/" },
        { text: "Cart", url: "/cart" },
        { text: "Meals", url: "/?cuisines=" },
        { text: "Restaurants", url: "/restaurants" },
      ],
    },
    {
      title: "For Providers",
      links: [
        { text: "Become a Partner", url: "/provider-profile/create" },
        { text: "List Your Dishes", url: "/provider/meals" },
      ],
    },
    // {
    //   title: "Socials",
    //   links: [
    //     { text: "Facebook", url: "https://www.facebook.com/md.almizan.akon" },
    //     { text: "Twitter", url: "https://x.com/MdAlmizanAkon2" },
    //     { text: "LinkedIn", url: "https://www.linkedin.com/in/al-mizan/" },
    //   ],
    // },
  ],
  copyright = `© ${new Date().getFullYear()} Khabo. All rights reserved.`,
}: Footer2Props) => {
  return (
    <section
      className={cn(
        "border-t bg-background/60 py-12 backdrop-blur-sm sm:py-14 lg:py-16 max-w-7xl mx-auto",
        className,
      )}
      aria-label="Site footer"
    >
      <div className="container mx-auto justify-around">
        <footer className="space-y-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Logo url={logo.url} aria-label="Khabo home">
                  <LogoImage
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 dark:invert"
                  />
                  <LogoText className="text-xl">{logo.title}</LogoText>
                </Logo>
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground sm:max-w-sm sm:text-base">
                {tagline}
              </p>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                Serving homemade and local favorites across Bangladesh.
              </p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx} className="text-center sm:text-left">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/80 sm:mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground sm:space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium transition-colors hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-center gap-4 border-t pt-6 text-xs font-medium text-muted-foreground sm:text-sm md:flex-row md:items-center">
            <p className="text-center md:text-left">{copyright}</p>
            {/* <ul className="flex flex-wrap justify-center gap-3 md:justify-end">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul> */}
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
