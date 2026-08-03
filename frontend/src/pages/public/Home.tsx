import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  AboutPreview,
  AchievementsPreview,
  AdmissionsJourney,
  AnnouncementsStrip,
  CallToAction,
  CommunityPartnership,
  FacilitiesPreview,
  GalleryPreview,
  Hero,
  LatestNews,
  LeadershipMessage,
  LifeBeyondClassroom,
  MissionVisionValues,
  PeopleWhoSupportLearning,
  Programs,
  QuickActions,
  Statistics,
  StudentLeadership,
  TeacherSpotlight,
  UpcomingEvents,
  VisitSchool,
} from "../../components/home";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 650, easing: "ease-out-cubic", once: true, offset: 70, disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    return () => AOS.refreshHard();
  }, []);

  return (
    <>
      <Hero />
      <AnnouncementsStrip />
      <QuickActions />
      <AboutPreview />
      <LeadershipMessage />
      <MissionVisionValues />
      <Programs />
      <TeacherSpotlight />
      <PeopleWhoSupportLearning />
      <StudentLeadership />
      <LifeBeyondClassroom />
      <FacilitiesPreview />
      <AchievementsPreview />
      <AdmissionsJourney />
      <CommunityPartnership />
      <Statistics />
      <LatestNews />
      <UpcomingEvents />
      <GalleryPreview />
      <VisitSchool />
      <CallToAction />
    </>
  );
}
