'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', age: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create Order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2 }),
      });
      const orderData = await orderRes.json();

      if (!orderData.id) {
        throw new Error('Failed to create order');
      }

      // 2. Initialize Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Health Action Journey',
        description: '21 Days Enrollment',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.isOk) {
              alert('Payment Verification Failed!');
              return;
            }

            // 4. Submit to Formspree in background
            try {
              await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...formData,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                }),
              });
            } catch (err) {
              console.error('Formspree submission failed:', err);
            }

            // 5. Redirect to Thank You Page
            router.push(`/thank-you?order_id=${response.razorpay_order_id}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
          } catch (err) {
            console.error('Verification error:', err);
            alert('Something went wrong during payment verification.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        console.error('Payment failed', response.error);
        alert('Payment failed. Please try again.');
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll Animation Observer
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, no need to observe again for smoother performance
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal, .revealSlideUp, .revealPop, .revealFade');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    <main>
      {/* Top Simple Sticky Bar */}
      <header className={styles.navbar} style={{ backgroundColor: '#0284c7' }}>
        <div className={`container ${styles.navContainer}`}>
          <div className={`${styles.logo} revealFade is-visible`}>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.25rem' }}>Join Cohort</span>
          </div>
          <a href="#enroll" className={`btn-primary revealFade is-visible`} style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            Join cohort Rs2
          </a>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={`${styles.heroBadge} revealPop`}>
            <span className="pulse-dot"></span>
            <span>Next Cohort Enrolling Now</span>
          </div>

          <h1 className={`${styles.heroTitle} revealSlideUp delay-100`}>
            Live Your Health <span className={styles.gradientText}>CoHort</span>
          </h1>

          <p className={`${styles.heroSubtitle} revealSlideUp delay-200`}>
            You&apos;ve learned what affects your health. Now it&apos;s time to learn how to live it — one day at a time.
          </p>

          <p className={`${styles.heroBody} revealSlideUp delay-300`}>
            A 3-week live journey through balanced meals, sleep, stress, emotional awareness, and the daily habits that actually hold — with tools and guidance you&apos;ll keep using long after Day 21.
          </p>

          <div className="revealPop delay-400">
            <div className={styles.quoteBox}>
              &quot;Knowing is not enough — action creates change.&quot;
            </div>
          </div>

          <div className="revealSlideUp delay-400">
            <div className={styles.statLine}>
              <span>21 Days / 3 Weeks</span>
              <span className={styles.statDivider}>·</span>
              <span>18 Live Sessions</span>
              <span className={styles.statDivider}>·</span>
              <span>Sundays Off</span>
            </div>
          </div>

          <div className="revealPop delay-500">
            <a href="#enroll" className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              Start My 21 Days — ₹2
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE GAP SECTION */}
      <section className={styles.gapSection}>
        <div className="container">
          <div className={`${styles.gapCard} revealPop`}>
            <span className={`${styles.eyebrow} reveal`}>The Gap</span>
            <h2 className={`${styles.sectionHeading} revealSlideUp delay-100`} style={{ marginBottom: '1.5rem' }}>
              Knowing Didn&apos;t Change Anything. Doing Will.
            </h2>

            <p className={`${styles.gapParagraph1} reveal delay-200`}>
              You already know sugar spikes your energy. You already know stress messes with your gut. You already know sleep matters. None of that knowledge has changed your Tuesday.
            </p>

            <div className={`${styles.gapHighlightedBox} revealSlideUp delay-300`}>
              This is where you stop collecting information and start building the habits. Short daily live sessions, real accountability, and 21 days to make it stick — long enough to become normal, short enough to actually finish.
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE JOURNEY SECTION */}
      <section className={styles.journeySection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={`${styles.eyebrow} reveal`}>The Journey</span>
          <h2 className={`${styles.sectionHeading} revealSlideUp delay-100`}>21 Days, Broken Into 3 Simple Weeks</h2>
          <p className={`${styles.sectionSubheading} reveal delay-200`}>
            Every session is 30–40 minutes, live. Sundays are yours to rest, reflect, and catch up.
          </p>

          <div className={styles.weeksGrid} style={{ textAlign: 'left' }}>
            {/* Week 01 */}
            <div className={`${styles.weekCard} revealSlideUp delay-100`}>
              <span className={styles.weekNumberBadge}>Week 01</span>
              <h3 className={styles.weekFocus}>Balanced Meals &amp; Nutrition</h3>
              <p className={styles.weekDetail}>
                Rebuild your plate — portioning, food pairing, and reading your own hunger and energy signals.
              </p>
            </div>

            {/* Week 02 */}
            <div className={`${styles.weekCard} revealSlideUp delay-200`}>
              <span className={styles.weekNumberBadge}>Week 02</span>
              <h3 className={styles.weekFocus}>Sleep &amp; Stress</h3>
              <p className={styles.weekDetail}>
                Fix the two things quietly undoing your nutrition — poor sleep and unmanaged stress — with daily resets.
              </p>
            </div>

            {/* Week 03 */}
            <div className={`${styles.weekCard} revealSlideUp delay-300`}>
              <span className={styles.weekNumberBadge}>Week 03</span>
              <h3 className={styles.weekFocus}>Emotional Awareness &amp; Habits</h3>
              <p className={styles.weekDetail}>
                Turn everything you&apos;ve learned into habits that hold up after the program ends, not just during it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE'LL WORK ON SECTION */}
      <section className={styles.areasSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={`${styles.eyebrow} reveal`}>What We&apos;ll Work On</span>
          <h2 className={`${styles.sectionHeading} revealSlideUp delay-100`}>Six Areas. Twenty-One Days. One New Normal.</h2>

          <div className={styles.areasGrid} style={{ textAlign: 'left' }}>
            <div className={`${styles.areaCard} revealPop delay-100`}>
              <h3 className={styles.areaCardTitle}>🥗 Balanced Meals</h3>
              <p className={styles.areaCardDesc}>No more guessing what should be on your plate.</p>
            </div>

            <div className={`${styles.areaCard} revealPop delay-200`}>
              <h3 className={styles.areaCardTitle}>🥑 Nutrition</h3>
              <p className={styles.areaCardDesc}>Turn what you learned in the masterclass into daily choices.</p>
            </div>

            <div className={`${styles.areaCard} revealPop delay-300`}>
              <h3 className={styles.areaCardTitle}>🌙 Sleep</h3>
              <p className={styles.areaCardDesc}>The habit that quietly makes or breaks everything else.</p>
            </div>

            <div className={`${styles.areaCard} revealPop delay-400`}>
              <h3 className={styles.areaCardTitle}>🧘 Stress</h3>
              <p className={styles.areaCardDesc}>Simple daily resets, not another thing to feel guilty about.</p>
            </div>

            <div className={`${styles.areaCard} revealPop delay-500`}>
              <h3 className={styles.areaCardTitle}>🧠 Emotional Awareness</h3>
              <p className={styles.areaCardDesc}>Notice what you eat around, not just what you eat.</p>
            </div>

            <div className={`${styles.areaCard} revealPop delay-600`}>
              <h3 className={styles.areaCardTitle}>⚡ Daily Habits</h3>
              <p className={styles.areaCardDesc}>Small, repeatable actions that outlast the 21 days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT'S INCLUDED SECTION */}
      <section className={styles.includedSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={`${styles.eyebrow} reveal`}>What&apos;s Included</span>
          <h2 className={`${styles.sectionHeading} revealSlideUp delay-100`}>Everything You Need to Make It Stick</h2>

          <div className={styles.includedList} style={{ textAlign: 'left' }}>
            <div className={`${styles.includedItem} revealSlideUp delay-100`}>
              <div className={styles.checkCircle}>✓</div>
              <div>18 live sessions, 30–40 minutes each — short enough to actually attend</div>
            </div>

            <div className={`${styles.includedItem} revealSlideUp delay-200`}>
              <div className={styles.checkCircle}>✓</div>
              <div>Practical tools and worksheets for meals, sleep, and stress you&apos;ll reuse for years</div>
            </div>

            <div className={`${styles.includedItem} revealSlideUp delay-300`}>
              <div className={styles.checkCircle}>✓</div>
              <div>A private space to ask questions and get real answers, not generic advice</div>
            </div>

            <div className={`${styles.includedItem} revealSlideUp delay-400`}>
              <div className={styles.checkCircle}>✓</div>
              <div>Resources and habit trackers you keep using well beyond Day 21</div>
            </div>

            <div className={`${styles.includedItem} revealSlideUp delay-500`}>
              <div className={styles.checkCircle}>✓</div>
              <div>Sundays completely off, every week — built for real life, not a bootcamp</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className={styles.faqSection}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className={`${styles.eyebrow} reveal`}>Before You Enroll</span>
            <h2 className={`${styles.sectionHeading} revealSlideUp delay-100`}>Still Have Questions? We&apos;ve Got You.</h2>
          </div>

          <div className={styles.faqContainer}>
            {[
              {
                q: 'Do I need to have attended the "Know Your Health" masterclass first?',
                a: "It helps, but it's not required. Each session includes enough context to follow along — this program is built to be lived, not just understood.",
              },
              {
                q: 'What happens if I miss a live session?',
                a: "You'll get access to the recording so you don't fall behind. Sundays are also built in as catch-up days.",
              },
              {
                q: 'Is this a diet plan?',
                a: "No. You won't get a rigid meal plan — you'll build the judgment to build your own, for the rest of your life.",
              },
              {
                q: 'How much time does this actually take per day?',
                a: "Just the 30–40 minute live session, plus whatever small action you choose to practice that day. It's designed to fit into a real, busy life.",
              },
              {
                q: 'Is ₹2 worth it for 21 days?',
                a: "That's under ₹250 a day for live coaching, tools, and accountability — less than what most people spend trying (and abandoning) diets on their own.",
              },
            ].map((faq, index) => (
              <div key={index} className={`${styles.faqItem} revealSlideUp`} style={{ transitionDelay: `${index * 80}ms` }}>
                <button className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                  <span>{faq.q}</span>
                  <span style={{ color: 'var(--accent-blue)', fontSize: '1.4rem' }}>
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ENROLL SECTION */}
      <section id="enroll" className={styles.enrollSection}>
        <div className="container">
          <div className={`${styles.enrollCard} revealPop`}>
            <h2 className="revealSlideUp delay-100" style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Join Cohort ! Fast
            </h2>
            
            <div className={`${styles.enrollPrice} revealPop delay-200`}>₹2</div>

            <div className={`${styles.eventDetailsBox} revealSlideUp delay-300`}>
              <div className={styles.eventDetailRow}>
                <span>📅</span>
                <span><strong>21 Days / 3 Weeks</strong> — start date announced soon</span>
              </div>
              <div className={styles.eventDetailRow}>
                <span>🎥</span>
                <span><strong>18 Live Sessions</strong>, 30–40 minutes each</span>
              </div>
              <div className={styles.eventDetailRow}>
                <span>🌤️</span>
                <span><strong>Sundays Off</strong></span>
              </div>
              <div className={styles.eventDetailRow}>
                <span>💻</span>
                <span><strong>Fully Online</strong></span>
              </div>
            </div>

            <form onSubmit={handlePayment} style={{ marginTop: '1.5rem', width: '100%' }}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name</label>
                  <input type="text" name="name" required className={styles.formInput} placeholder="Your Name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input type="email" name="email" required className={styles.formInput} placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input type="tel" name="phone" required className={styles.formInput} placeholder="+91" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Age</label>
                  <input type="number" name="age" required className={styles.formInput} placeholder="Your Age" value={formData.age} onChange={handleInputChange} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <input type="text" name="city" required className={styles.formInput} placeholder="Your City" value={formData.city} onChange={handleInputChange} />
              </div>
              <button type="submit" disabled={isSubmitting} className={`btn-primary revealPop delay-400 ${styles.formSubmitBtn}`}>
                {isSubmitting ? 'Processing...' : 'Proceed to Pay ₹2 →'}
              </button>
            </form>

            <div className={`${styles.urgencyLine} reveal delay-500`}>
              Cohort seats are limited to keep the group personal
            </div>

            <div className={`${styles.securityText} reveal delay-600`}>
              🔒 Secure payment with Razorpay
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLOSING CTA SECTION */}
      <section className={styles.closingSection}>
        <div className="container">
          <div className={`${styles.closingBox} revealPop`}>
            <h2 className={`${styles.closingTitle} revealSlideUp delay-100`}>
              21 Days From Now, You Could Just Know — Or You Could Live It.
            </h2>
            <p className={`${styles.closingSubtitle} reveal delay-200`}>
              Knowing is not enough. Action creates change — starting with the next 21 days.
            </p>
            <div className="revealPop delay-300">
              <a href="#enroll" className={styles.closingBtn}>
                Start My 21 Days — ₹2
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} 21-Day Health Action Journey. All rights reserved.</p>
        </div>
      </footer>
    </main>
    </>
  );
}
