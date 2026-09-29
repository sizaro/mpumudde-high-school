export type PublicNavigationItem = {
  label: string;
  to: string;
  end?: boolean;
  children?: Array<{ label: string; to: string }>;
};

export const publicNavigation: PublicNavigationItem[] = [
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Admissions", to: "/admissions" },
  { label: "Alumni", to: "/alumni" },
  { label: "Newsroom", to: "/newsroom" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];
