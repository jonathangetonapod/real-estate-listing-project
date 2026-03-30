import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing, staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont as loadLibreCaslon } from "@remotion/google-fonts/LibreCaslonText";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: headingFont } = loadLibreCaslon("normal", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: monoFont } = loadJetBrainsMono("normal", { weights: ["400", "700"], subsets: ["latin"] });
const bodyFont = "system-ui, -apple-system, sans-serif";

const ORANGE = "#FF5924";
const CHARCOAL = "#222B27";
const LIGHT_BG = "#F2F4EF";
const WHITE = "#FFFFFF";
const SUCCESS = "#019F11";
const DANGER = "#BC1619";
const LIME = "#B9E97D";

// Typewriter effect
function useTypewriter(text: string, startFrame: number, charsPerFrame = 0.5) {
  const frame = useCurrentFrame();
  const chars = Math.min(text.length, Math.floor((frame - startFrame) * charsPerFrame));
  return frame >= startFrame ? text.slice(0, Math.max(0, chars)) : "";
}

// Blinking cursor
function Cursor({ visible }: { visible: boolean }) {
  const frame = useCurrentFrame();
  const blink = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (!visible) return null;
  return <span style={{ opacity: blink, color: ORANGE }}>|</span>;
}

// Count-up number
function CountUp({ target, startFrame, duration = 60, prefix = "", suffix = "" }: {
  target: number; startFrame: number; duration?: number; prefix?: string; suffix?: string;
}) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const value = Math.round(progress * target);
  return <>{prefix}{value.toLocaleString()}{suffix}</>;
}

// Animated gradient background
function GradientBG({ color1, color2, children }: { color1: string; color2: string; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 600], [135, 180], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }}>
      {children}
    </AbsoluteFill>
  );
}

// Floating particles
function Particles({ count = 20, color = "rgba(255,89,36,0.1)" }: { count?: number; color?: string }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 137.5) % 100;
        const baseY = (i * 73.3) % 100;
        const y = baseY - (frame * (0.1 + (i % 5) * 0.05)) % 120;
        const size = 4 + (i % 3) * 4;
        const opacity = interpolate(y, [-20, 0, 80, 100], [0, 0.6, 0.6, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            opacity,
          }} />
        );
      })}
    </AbsoluteFill>
  );
}

// Word highlight wipe
function HighlightWord({ word, color, delay = 0 }: { word: string; color: string; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ fps, frame, config: { damping: 200 }, delay, durationInFrames: 18 });
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{
        position: "absolute", left: -4, right: -4, top: "50%", height: "1.1em",
        transform: `translateY(-50%) scaleX(${progress})`, transformOrigin: "left center",
        backgroundColor: color, borderRadius: "0.15em", zIndex: 0,
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>{word}</span>
    </span>
  );
}

// ======= SCENES =======

// Scene 1: Hook with typewriter
function HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = useTypewriter("Still cold calling", 10, 0.8);
  const line2 = useTypewriter("for listings?", 45, 0.8);
  const showCursor = frame < 80;

  const subtitleOpacity = interpolate(frame, [85, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [85, 105], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <GradientBG color1={CHARCOAL} color2="#1a1f1c">
      <Particles count={15} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          fontFamily: headingFont, fontSize: 80, fontWeight: 700, color: WHITE,
          textAlign: "center", lineHeight: 1.1, maxWidth: 900,
        }}>
          {line1}
          <br />
          <span style={{ color: ORANGE }}>{line2}</span>
          <Cursor visible={showCursor} />
        </div>
        <div style={{
          fontFamily: bodyFont, fontSize: 28, color: "rgba(255,255,255,0.4)",
          marginTop: 32, opacity: subtitleOpacity, transform: `translateY(${subtitleY}px)`,
        }}>
          3-step sequences. Verified leads. One platform.
        </div>
      </AbsoluteFill>
    </GradientBG>
  );
}

// Scene 2: Problem — Zillow comparison with dramatic reveal
function ProblemScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Zillow card
  const zillowEnter = spring({ frame, fps, config: { damping: 12 }, delay: 20 });
  const zillowStrike = interpolate(frame, [80, 110], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zillowShake = frame > 110 && frame < 130 ? Math.sin(frame * 0.8) * 3 : 0;

  // VS
  const vsScale = spring({ frame, fps, config: { damping: 15 }, delay: 100 });

  // OffMarket card
  const lsEnter = spring({ frame, fps, config: { damping: 12 }, delay: 120 });
  const lsGlow = interpolate(frame, [150, 180], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: WHITE, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        fontFamily: headingFont, fontSize: 42, fontWeight: 700, color: CHARCOAL,
        marginBottom: 60, opacity: headerOpacity, textAlign: "center",
      }}>
        The average agent spends...
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Zillow */}
        <div style={{
          transform: `scale(${zillowEnter}) translateX(${zillowShake}px)`,
          background: "#FFF5F5", borderRadius: 20, padding: "48px 56px", textAlign: "center",
          border: `2px solid ${DANGER}20`,
        }}>
          <div style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#999", marginBottom: 16 }}>
            Zillow Leads
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 72, fontWeight: 700, color: DANGER, position: "relative" }}>
            $1,200+
            <div style={{
              position: "absolute", top: "50%", left: 0,
              width: `${zillowStrike}%`, height: 5, background: DANGER, borderRadius: 2,
            }} />
          </div>
          <div style={{ fontFamily: bodyFont, fontSize: 16, color: "#999", marginTop: 12 }}>
            per month
          </div>
          <div style={{
            fontFamily: monoFont, fontSize: 13, color: DANGER, marginTop: 8,
            background: `${DANGER}10`, borderRadius: 8, padding: "6px 16px",
          }}>
            Shared with 47 agents
          </div>
        </div>

        {/* VS */}
        <div style={{
          fontFamily: bodyFont, fontSize: 28, fontWeight: 700, color: "#ccc",
          transform: `scale(${vsScale})`,
        }}>
          vs
        </div>

        {/* OffMarket */}
        <div style={{
          transform: `scale(${lsEnter})`,
          background: "#F0FFF4", borderRadius: 20, padding: "48px 56px", textAlign: "center",
          border: `2px solid ${SUCCESS}30`,
          boxShadow: `0 0 ${lsGlow}px ${lsGlow / 2}px ${SUCCESS}20`,
        }}>
          <div style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: ORANGE, marginBottom: 16 }}>
            OffMarket
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 72, fontWeight: 700, color: SUCCESS }}>
            $299
          </div>
          <div style={{ fontFamily: bodyFont, fontSize: 16, color: "#666", marginTop: 12 }}>
            per month
          </div>
          <div style={{
            fontFamily: monoFont, fontSize: 13, color: SUCCESS, marginTop: 8,
            background: `${SUCCESS}10`, borderRadius: 8, padding: "6px 16px",
          }}>
            Exclusive to your zip code
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Scene 3: Solution — 3-step sequence preview with A/B/C variations
function SolutionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: "clamp" });

  // Animated email mockup
  const emailEnter = spring({ frame, fps, config: { damping: 15 }, delay: 40 });
  const emailSubject = useTypewriter("Oakwood Dr comp just closed at $485K", 70, 0.6);
  const emailBody = useTypewriter(
    "Hi, your listing at 4821 Oakwood Dr came off the MLS about 47 days ago at $459K. A 3-bed on the same block just closed at $485K last week...",
    110, 0.5
  );
  const showEmailCursor = frame > 70 && frame < 220;

  // Highlight words in the email
  const highlightDelay = 230;

  // Step tabs
  const stepTabs = [
    { label: "Step 1 \u00B7 Initial Outreach", active: true },
    { label: "Step 2 \u00B7 Follow-Up", active: false },
    { label: "Step 3 \u00B7 Final Touch", active: false },
  ];
  const tabsEnter = spring({ frame, fps, config: { damping: 15 }, delay: 50 });

  // A/B/C variation picker
  const variationEnter = spring({ frame, fps, config: { damping: 15 }, delay: 60 });

  return (
    <GradientBG color1={CHARCOAL} color2="#1a2420">
      <Particles count={10} color="rgba(255,89,36,0.06)" />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 120px" }}>
        <div style={{
          fontFamily: headingFont, fontSize: 52, fontWeight: 700, color: WHITE,
          textAlign: "center", opacity: headlineOpacity, transform: `translateY(${headlineY}px)`,
          marginBottom: 48, lineHeight: 1.15,
        }}>
          AI writes 3-step sequences.{" "}
          <span style={{ color: ORANGE, fontStyle: "italic" }}>You pick the variation.</span>
        </div>

        {/* Email mockup */}
        <div style={{
          background: WHITE, borderRadius: 16, width: 800, overflow: "hidden",
          transform: `scale(${emailEnter})`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          {/* Step tabs */}
          <div style={{
            display: "flex", borderBottom: "1px solid #eee",
            transform: `scale(${tabsEnter})`, transformOrigin: "top center",
          }}>
            {stepTabs.map((tab, i) => (
              <div key={i} style={{
                flex: 1, padding: "12px 16px", textAlign: "center",
                fontFamily: monoFont, fontSize: 12, fontWeight: tab.active ? 700 : 400,
                color: tab.active ? ORANGE : "#999",
                borderBottom: tab.active ? `3px solid ${ORANGE}` : "3px solid transparent",
                background: tab.active ? `${ORANGE}05` : "transparent",
              }}>
                {tab.label}
              </div>
            ))}
          </div>

          {/* Timing indicator + A/B/C picker row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 24px", borderBottom: "1px solid #f0f0f0",
            transform: `scale(${variationEnter})`, transformOrigin: "top center",
          }}>
            <div style={{ fontFamily: monoFont, fontSize: 11, color: SUCCESS }}>
              Sends immediately
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: bodyFont, fontSize: 11, color: "#999", marginRight: 4 }}>Variation:</span>
              {["A", "B", "C"].map((v, i) => (
                <div key={v} style={{
                  width: 26, height: 26, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: monoFont, fontSize: 11, fontWeight: 700,
                  background: i === 0 ? ORANGE : "#f0f0f0",
                  color: i === 0 ? WHITE : "#999",
                  border: i === 0 ? "none" : "1px solid #ddd",
                  cursor: "pointer",
                }}>
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Email header */}
          <div style={{
            padding: "16px 24px", borderBottom: "1px solid #eee",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: ORANGE,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: bodyFont, fontSize: 13, fontWeight: 700, color: WHITE,
            }}>
              OM
            </div>
            <div>
              <div style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 600, color: CHARCOAL }}>
                Sarah Johnson via OffMarket
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: 12, color: "#999" }}>
                to: homeowner@email.com
              </div>
            </div>
            <div style={{
              marginLeft: "auto", fontFamily: monoFont, fontSize: 11, color: SUCCESS,
              background: `${SUCCESS}10`, borderRadius: 6, padding: "4px 10px",
            }}>
              94% inbox rate
            </div>
          </div>

          {/* Subject line */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f5f5f5" }}>
            <div style={{ fontFamily: bodyFont, fontSize: 11, color: "#999", marginBottom: 4 }}>Subject</div>
            <div style={{ fontFamily: bodyFont, fontSize: 16, fontWeight: 600, color: CHARCOAL }}>
              {emailSubject}
              <Cursor visible={showEmailCursor && frame < 110 + 60} />
            </div>
          </div>

          {/* Email body */}
          <div style={{ padding: "20px 24px", minHeight: 120 }}>
            <div style={{ fontFamily: bodyFont, fontSize: 15, color: "#555", lineHeight: 1.7 }}>
              {frame >= highlightDelay ? (
                <>
                  Hi, your listing at{" "}
                  <HighlightWord word="4821 Oakwood Dr" color={`${ORANGE}20`} delay={0} />
                  {" "}came off the MLS about{" "}
                  <HighlightWord word="47 days ago" color={`${ORANGE}20`} delay={10} />
                  {" "}at $459K. A 3-bed on the same block just closed at{" "}
                  <HighlightWord word="$485K" color={`${ORANGE}20`} delay={20} />
                  {" "}last week...
                </>
              ) : (
                <>
                  {emailBody}
                  <Cursor visible={showEmailCursor && frame >= 110 + 60} />
                </>
              )}
            </div>
          </div>

          {/* Data sources bar */}
          {frame > highlightDelay + 30 && (
            <div style={{
              padding: "12px 24px", background: "#fafafa", borderTop: "1px solid #eee",
              display: "flex", gap: 8, alignItems: "center",
              opacity: interpolate(frame, [highlightDelay + 30, highlightDelay + 50], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              }),
            }}>
              <span style={{ fontFamily: bodyFont, fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Data:
              </span>
              {["MLS listing", "Sold comps", "Days expired", "Equity estimate"].map((tag, i) => (
                <span key={i} style={{
                  fontFamily: monoFont, fontSize: 10, color: SUCCESS,
                  background: `${SUCCESS}08`, border: `1px solid ${SUCCESS}20`,
                  borderRadius: 4, padding: "3px 8px",
                  transform: `scale(${spring({ frame: Math.max(0, frame - highlightDelay - 40 - i * 5), fps, config: { damping: 15 } })})`,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </GradientBG>
  );
}

// Scene 4: How It Works — staggered step reveal with connecting lines
function HowItWorksScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: 1, title: "Pick your zip codes", desc: "We find 250+ verified sellers", startFrame: 30 },
    { num: 2, title: "Review 3-step sequences", desc: "A/B/C variations per step", startFrame: 80 },
    { num: 3, title: "Approve and send", desc: "Sequences auto-deploy on business days", startFrame: 130 },
    { num: 4, title: "Manage your Inbox", desc: "Reply to sellers, tag conversations", startFrame: 180 },
    { num: 5, title: "Close in your pipeline", desc: "Positive Reply \u2192 Closed", startFrame: 230 },
  ];

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  return (
    <AbsoluteFill style={{ background: LIGHT_BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        fontFamily: monoFont, fontSize: 13, fontWeight: 600, color: ORANGE,
        textTransform: "uppercase", letterSpacing: 4, marginBottom: 16, opacity: labelOpacity,
      }}>
        How It Works
      </div>
      <div style={{
        fontFamily: headingFont, fontSize: 52, fontWeight: 700, color: CHARCOAL,
        marginBottom: 80, transform: `scale(${titleScale})`,
      }}>
        Five steps to your next listing.
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, position: "relative" }}>
        {steps.map((step, i) => {
          const enter = spring({ frame, fps, config: { damping: 12 }, delay: step.startFrame });
          const lineProgress = i < steps.length - 1
            ? interpolate(frame, [step.startFrame + 20, steps[i + 1].startFrame], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })
            : 0;

          return (
            <div key={step.num} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 200, position: "relative" }}>
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 24, left: "calc(50% + 30px)", width: 130,
                  height: 3, background: `${ORANGE}15`, borderRadius: 2, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${lineProgress * 100}%`, height: "100%",
                    background: ORANGE, borderRadius: 2,
                  }} />
                </div>
              )}

              <div style={{
                transform: `scale(${enter})`, display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: CHARCOAL,
                  color: WHITE, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: monoFont, fontSize: 20, fontWeight: 700, marginBottom: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}>
                  {step.num}
                </div>
                <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: CHARCOAL, marginBottom: 6, textAlign: "center" }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 13, color: "#888", textAlign: "center" }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// Scene 5: Stats with count-up
function StatsScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 250, suffix: "", label: "verified leads/month", delay: 20 },
    { value: 3, suffix: "", label: "step sequences", delay: 35 },
    { value: 5, suffix: "", label: "pipeline stages", delay: 50 },
    { value: 99, prefix: "$", suffix: "", label: "per month", delay: 65 },
  ];

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <GradientBG color1={CHARCOAL} color2="#1a2420">
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          fontFamily: headingFont, fontSize: 44, fontWeight: 700, color: WHITE,
          marginBottom: 64, opacity: headerOpacity, textAlign: "center",
        }}>
          The numbers speak for themselves.
        </div>

        <div style={{ display: "flex", gap: 80 }}>
          {stats.map((stat, i) => {
            const enter = spring({ frame, fps, config: { damping: 15 }, delay: stat.delay });
            return (
              <div key={i} style={{ textAlign: "center", transform: `scale(${enter})` }}>
                <div style={{ fontFamily: monoFont, fontSize: 56, fontWeight: 700, color: ORANGE }}>
                  <CountUp target={stat.value} startFrame={stat.delay} duration={45} prefix={stat.prefix || ""} suffix={stat.suffix} />
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </GradientBG>
  );
}

// Scene 6: CTA — big finish
function CTAScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEnter = spring({ frame, fps, config: { damping: 10 } });
  const priceEnter = spring({ frame, fps, config: { damping: 12 }, delay: 25 });
  const foundingOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaEnter = spring({ frame, fps, config: { damping: 12 }, delay: 80 });
  const urlOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulsing glow on CTA
  const glowSize = interpolate(frame % 60, [0, 30, 60], [15, 25, 15]);

  return (
    <GradientBG color1={CHARCOAL} color2="#0f1210">
      <Particles count={25} color="rgba(255,89,36,0.08)" />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          fontFamily: headingFont, fontSize: 68, fontWeight: 700, color: WHITE,
          textAlign: "center", transform: `scale(${headlineEnter})`, lineHeight: 1.1, marginBottom: 40,
        }}>
          Stop competing.
          <br />
          <HighlightWord word="Own your market." color={`${ORANGE}30`} delay={20} />
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 12, transform: `scale(${priceEnter})`, marginBottom: 16 }}>
          <span style={{ fontFamily: monoFont, fontSize: 72, fontWeight: 700, color: ORANGE }}>$299</span>
          <span style={{ fontFamily: bodyFont, fontSize: 24, color: "rgba(255,255,255,0.4)" }}>/month</span>
        </div>

        <div style={{
          fontFamily: bodyFont, fontSize: 20, color: "rgba(255,255,255,0.5)",
          marginBottom: 48, opacity: foundingOpacity,
        }}>
          Founding members: <span style={{ color: ORANGE }}>$299/mo</span>
        </div>

        <div style={{
          background: ORANGE, borderRadius: 16, padding: "22px 56px",
          transform: `scale(${ctaEnter})`,
          boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px ${ORANGE}40`,
        }}>
          <span style={{ fontFamily: bodyFont, fontSize: 24, fontWeight: 600, color: WHITE }}>
            Join the Waitlist
          </span>
        </div>

        <div style={{
          fontFamily: monoFont, fontSize: 20, color: "rgba(255,255,255,0.25)",
          marginTop: 32, letterSpacing: 1, opacity: urlOpacity,
        }}>
          offmarket.com/waitlist
        </div>

        {/* Limited spots badge */}
        <div style={{
          fontFamily: monoFont, fontSize: 13, color: ORANGE,
          background: `${ORANGE}10`, border: `1px solid ${ORANGE}20`,
          borderRadius: 20, padding: "8px 20px", marginTop: 20, opacity: urlOpacity,
        }}>
          Limited to 5 agents per zip code
        </div>
      </AbsoluteFill>
    </GradientBG>
  );
}

// ======= MAIN COMPOSITION =======

export const OffMarketVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      {/* Background music */}
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 1 * fps, durationInFrames - 2 * fps, durationInFrames], [0, 0.35, 0.35, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        loop
      />
    <TransitionSeries>
      {/* Scene 1: Hook (5s) */}
      <TransitionSeries.Sequence durationInFrames={180}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 2: Problem (10s) */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <ProblemScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
      />

      {/* Scene 3: Solution / Email (12s) */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <SolutionScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe()}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 4: How It Works (12s) */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <HowItWorksScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 5: Stats (6s) */}
      <TransitionSeries.Sequence durationInFrames={180}>
        <StatsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
      />

      {/* Scene 6: CTA (12s) */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    </>
  );
};
