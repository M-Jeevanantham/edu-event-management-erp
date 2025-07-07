import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CountUpComponent = () => {
  const countRef1 = useRef(null);
  const countRef2 = useRef(null);
  const countRef3 = useRef(null);

  useEffect(() => {
    const animateCount = (ref, endValue) => {
      let triggered = false;

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        once: true, // Ensures it triggers only once
        onEnter: () => {
          if (!triggered) {
            triggered = true;
            let obj = { val: 0 };
            gsap.to(obj, {
              val: endValue,
              duration: 2,
              ease: 'power3.out',
              onUpdate: () => {
                ref.current.textContent = Math.floor(obj.val);
              },
            });
          }
        },
      });
    };

    animateCount(countRef1, 100); // Institutions
    animateCount(countRef2, 250); // Educators
    animateCount(countRef3, 500); // Students
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="bg-white p-6 rounded shadow">
        <h4 className="text-lg font-semibold">Institutions</h4>
        <p ref={countRef1} className="text-3xl font-bold text-[#4E6766]">0</p>
        <p>Organize Events</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h4 className="text-lg font-semibold">Educators</h4>
        <p ref={countRef2} className="text-3xl font-bold text-[#4E6766]">0</p>
        <p>Lead Sessions</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h4 className="text-lg font-semibold">Students</h4>
        <p ref={countRef3} className="text-3xl font-bold text-[#4E6766]">0</p>
        <p>Participate</p>
      </div>
    </div>
  );
};

export default CountUpComponent;
