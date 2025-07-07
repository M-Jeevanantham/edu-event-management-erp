import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const setupHomePageAnimations = (countRefs) => {
  // Section fade-ins
  gsap.utils.toArray('.section').forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Count-up triggers
  const animateCount = (ref, endValue) => {
    let obj = { val: 0 };
    ScrollTrigger.create({
      trigger: ref,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: endValue,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            if (ref) ref.textContent = Math.floor(obj.val);
          },
        });
      },
    });
  };

  animateCount(countRefs.count1, 100); // Institutions
  animateCount(countRefs.count2, 250); // Educators
  animateCount(countRefs.count3, 500); // Students
};
