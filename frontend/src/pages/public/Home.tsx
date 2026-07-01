import {
  Hero,
  QuickActions,
  AboutPreview,
  PrincipalMessage,
  Statistics,
  Programs,
  LatestNews,
  UpcomingEvents,
  GalleryPreview,
  Testimonials,
  CallToAction,
} from "../../components/home";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickActions />
      <AboutPreview />
      <PrincipalMessage />
      <Statistics />
      <Programs />
      <LatestNews />
      <UpcomingEvents />
      <GalleryPreview />
      <Testimonials />
      <CallToAction />
    </>
  );
}